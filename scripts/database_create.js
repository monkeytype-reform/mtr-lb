import { writeFile } from "node:fs";
import handles from "../data/handles.json" with { type: "json" };
import { getBestScores } from "../modules/personalBests.js";

let counter = 0;
let db = {};
let dbMin = {};

function saveJsonAsFile(data, filename) {
    writeFile(filename, data, "utf-8", (err) => {
        if (err) {
            throw new Error(err)
        }
    })
}

function loadNextProfile() {
    if (counter < handles.collection.length) {
        fetchProfile(handles.collection[counter]);
    } else {
        console.log("All profiles fetched successfully.");
        console.log(db)
        saveJsonAsFile(JSON.stringify(db, null, 2), "data/database.json")
        saveJsonAsFile(JSON.stringify(dbMin), "data/database_min.json")
    }
}

function fetchProfile(handle) {
    fetch(`https://api.monkeytype.com/users/${handle}/profile?isUid=false`)
        .then(res => {
            if (res.status == 200) {
                return res.json()
            } else {
                throw new Error("Failed to fetch profile for handle: " + handle);
            }
        })
        .then(profileData => {
            if (profileData.message != "Profile retrieved") {
                throw new Error("Could not retrieve profile for handle: " + handle);
            }

            const bestScores = getBestScores(profileData.data.personalBests);

            const pb15s = bestScores.time["15"];
            const pb60s = bestScores.time["60"];

            if (pb15s == null || pb60s == null) {
                console.log(`No personal bests found for handle: ${handle}, skipping addition to database.`);
                counter++;
                loadNextProfile();
                return; // Skip this handle if no English PBs are found
            }

            db[handle] = {
                "15s": {
                    "acc": pb15s.acc,
                    "consistency": pb15s.consistency,
                    "wpm": pb15s.wpm,
                    "raw": pb15s.raw
                },
                "60s": {
                    "acc": pb60s.acc,
                    "consistency": pb60s.consistency,
                    "wpm": pb60s.wpm,
                    "raw": pb60s.raw
                }
            };
            dbMin[handle] = [
                [
                    pb15s.acc,
                    pb15s.consistency,
                    pb15s.wpm,
                    pb15s.raw
                ],
                [
                    pb60s.acc,
                    pb60s.consistency,
                    pb60s.wpm,
                    pb60s.raw
                ]
            ]
            counter++;
            loadNextProfile()
        })
}

fetchProfile(handles.collection[counter]);