export function getBestScores(pbData) {
    let resolvedPBData = {
        time: {
            '15': null,
            '60': null
        },
        words: {
            '10': null
        },
    };
    for(let mode in pbData) {
        for (let mode2 in pbData[mode]) {
            const bestScoreInMode = (pbData[mode][mode2] ?? []).sort((a, b) => b.wpm - a.wpm)[0];
            resolvedPBData[mode][mode2] = bestScoreInMode;
        }
    }
    return resolvedPBData;
}