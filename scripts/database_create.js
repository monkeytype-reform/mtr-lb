import handles from "../data/handles.json" with { type: "json" };
import { writeFile } from "node:fs";

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
            db[handle] = {
                "15s": {
                    "acc": profileData.data.personalBests.time["15"][0].acc,
                    "consistency": profileData.data.personalBests.time["15"][0].consistency,
                    "wpm": profileData.data.personalBests.time["15"][0].wpm,
                    "raw": profileData.data.personalBests.time["15"][0].raw
                },
                "60s": {
                    "acc": profileData.data.personalBests.time["60"][0].acc,
                    "consistency": profileData.data.personalBests.time["60"][0].consistency,
                    "wpm": profileData.data.personalBests.time["60"][0].wpm,
                    "raw": profileData.data.personalBests.time["60"][0].raw
                }
            };
            dbMin[handle] = [
                [
                    profileData.data.personalBests.time["15"][0].acc,
                    profileData.data.personalBests.time["15"][0].consistency,
                    profileData.data.personalBests.time["15"][0].wpm,
                    profileData.data.personalBests.time["15"][0].raw
                ],
                [
                    profileData.data.personalBests.time["60"][0].acc,
                    profileData.data.personalBests.time["60"][0].consistency,
                    profileData.data.personalBests.time["60"][0].wpm,
                    profileData.data.personalBests.time["60"][0].raw
                ]
            ]
            counter++;
            if (counter < handles.collection.length) {
                fetchProfile(handles.collection[counter]);
            } else {
                console.log("All profiles fetched successfully.");
                console.log(db)
                saveJsonAsFile(JSON.stringify(db, null, 2), "data/database.json")
                saveJsonAsFile(JSON.stringify(dbMin), "data/database_min.json")
            }
        })
}

fetchProfile(handles.collection[counter]);


