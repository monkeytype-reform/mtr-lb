export function getBestScores(pbData) {
    let resolvedPBData = {};
    for(let mode in pbData) {
        resolvedPBData[mode] = {};
        for (let mode2 in pbData[mode]) {
            const bestScoreInMode = (pbData[mode][mode2] ?? []).sort((a, b) => b.wpm - a.wpm)[0];
            resolvedPBData[mode][mode2] = bestScoreInMode;
        }
    }
    return resolvedPBData;
}