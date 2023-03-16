"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSO18B = exports.ScoreSO17B = exports.ScoreSO16B = exports.ScoreSO15B = exports.ScoreSO14B = exports.ScoreSO13B = exports.ScoreSO12B = exports.ScoreSO11B = exports.ScoreSO10B = exports.ScoreSO09B = exports.ScoreSO08B = exports.ScoreSO07B = exports.ScoreSO06B = exports.ScoreSO05B = exports.ScoreSO04B = exports.ScoreSO03B = exports.ScoreSO02B = exports.ScoreSO01B = void 0;
const score_1 = require("./score");
function ScoreSO01B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.SmartRoadGetNeighbor)(worldMap, { x: x, y: y }, '', 'RD', false).length >
                0) {
                score -= 1;
            }
            else {
                score += 1;
            }
        }
    }
    return score;
}
exports.ScoreSO01B = ScoreSO01B;
function ScoreSO02B(worldMap, myClusterData) {
    let score = 0;
    const toCheck = (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'COL', '2d_list_values').concat((0, score_1.GetClustersInfo)(worldMap, myClusterData, 'ROW', '2d_list_values'));
    toCheck.forEach((cluster) => {
        if (cluster.filter((value) => value.includes('-PAR')).length === 3) {
            score += 1;
        }
        else if (cluster.filter((value) => value.includes('-PAR')).length === 0) {
            score -= 3;
        }
    });
    return score;
}
exports.ScoreSO02B = ScoreSO02B;
function ScoreSO03B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            score +=
                (0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'PAR-').length === 1
                    ? 1
                    : (0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1
                        ? -3
                        : 0;
        }
    }
    return score;
}
exports.ScoreSO03B = ScoreSO03B;
function ScoreSO04B(worldMap, myClusterData) {
    let score = -8;
    for (let y = 1; y < worldMap.length - 1; y++) {
        if (score === 7) {
            break;
        }
        for (let x = 1; x < worldMap.length - 1; x++) {
            if (score === 7) {
                break;
            }
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_2x2', worldMap[y][x].slice(0, 3)).length === 4) {
                score += 3;
            }
        }
    }
    return score;
}
exports.ScoreSO04B = ScoreSO04B;
function ScoreSO05B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1) {
                if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_adj', 'IND-').length +
                    (0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_adj', 'COM-').length ===
                    4) {
                    score += 2;
                }
            }
        }
    }
    return score;
}
exports.ScoreSO05B = ScoreSO05B;
function ScoreSO06B(worldMap, myClusterData) {
    let score = 0;
    score += Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RES', '1d_list_lengths'));
    score -= Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'IND', '1d_list_lengths'));
    return score;
}
exports.ScoreSO06B = ScoreSO06B;
function ScoreSO07B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'PAR-').length === 1) {
                if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_adj', '').length === 0) {
                    score += 1;
                }
                else {
                    score -= 2;
                }
            }
        }
    }
    return score;
}
exports.ScoreSO07B = ScoreSO07B;
function ScoreSO08B(worldMap, myClusterData) {
    const scores = [];
    const _2dListLongest = (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RES', '2d_list_longest');
    _2dListLongest.forEach((cluster) => {
        let score = 0;
        const parks = new Set();
        const inds = new Set();
        cluster.forEach((myCoord) => {
            (0, score_1.GetNeighbor)(worldMap, myCoord, 'self', 'PAR-').forEach((theirCoord) => {
                if (!parks.has(theirCoord)) {
                    parks.add(theirCoord);
                    score += 1;
                }
            });
            (0, score_1.GetNeighbor)(worldMap, myCoord, 'self', 'IND-').forEach((theirCoord) => {
                if (!inds.has(theirCoord)) {
                    inds.add(theirCoord);
                    score -= 3;
                }
            });
        });
        scores.push(score);
    });
    return Math.max(...scores);
}
exports.ScoreSO08B = ScoreSO08B;
function ScoreSO09B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1) {
                if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_cross', 'IND-').length > 0) {
                    score += 1;
                }
            }
        }
    }
    return score;
}
exports.ScoreSO09B = ScoreSO09B;
function ScoreSO10B(worldMap, myClusterData) {
    let score = 0;
    const toCheck = [
        ...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'COL', '2d_list_values'),
        ...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'ROW', '2d_list_values'),
    ];
    score = Math.max(...toCheck.map((cluster) => cluster.filter((value) => value.includes('-COM')).length()));
    return score;
}
exports.ScoreSO10B = ScoreSO10B;
function ScoreSO11B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'COM-').length === 1) {
                if ((0, score_1.SmartRoadGetNeighbor)(worldMap, { x: x, y: y }, '', 'RD', true).filter((myCoord) => (0, score_1.GetNeighbor)(worldMap, { x: myCoord.x, y: myCoord.y }, 'self', 'RES-').length === 1).length > 2) {
                    score += 2;
                }
            }
        }
    }
    return score;
}
exports.ScoreSO11B = ScoreSO11B;
function ScoreSO12B(worldMap, myClusterData) {
    let score = 0;
    score =
        Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RD', '1d_list_lengths')) / 2;
    return score;
}
exports.ScoreSO12B = ScoreSO12B;
function ScoreSO13B(worldMap, myClusterData) {
    let score = 0;
    (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RD', '2d_list_coords').forEach((cluster) => {
        if (cluster
            .filter((myCoord) => (0, score_1.SmartRoadGetNeighbor)(worldMap, { x: myCoord.x, y: myCoord.y }, '', 'RD', true).length === 1)
            .filter((myCoord) => (0, score_1.GetNeighbor)(worldMap, { x: myCoord.x, y: myCoord.y }, 'self', 'PAR-').length === 1).length === 2) {
            score += 3;
        }
    });
    return score;
}
exports.ScoreSO13B = ScoreSO13B;
function ScoreSO14B(worldMap, myClusterData) {
    let score = 0;
    score = (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RD', '2d_list_coords')
        .filter((cluster) => cluster.filter((myCoord) => (0, score_1.SmartRoadGetNeighbor)(worldMap, { x: myCoord.x, y: myCoord.y }, '', 'RD', true).length < 2).length > 0)
        .map((cluster) => cluster.length)
        .reduce((partialSum, a) => partialSum + a, 0);
    return score;
}
exports.ScoreSO14B = ScoreSO14B;
function ScoreSO15B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'RES-').length === 1) {
                if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_adj', 'IND-').length >= 2) {
                    score += 2;
                }
            }
        }
    }
    return score;
}
exports.ScoreSO15B = ScoreSO15B;
function ScoreSO16B(worldMap, myClusterData) {
    let score = 0;
    score =
        (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RD', '2d_list_coords').filter((cluster) => cluster.filter((coord) => (0, score_1.GetNeighbor)(worldMap, { x: coord.x, y: coord.y }, 'self', 'RES')
            .length > 0).length > 0 &&
            cluster.filter((innerCoord) => (0, score_1.GetNeighbor)(worldMap, { x: innerCoord.x, y: innerCoord.y }, 'self', 'COM').length > 0).length > 0).length * 2;
    return score;
}
exports.ScoreSO16B = ScoreSO16B;
function ScoreSO17B(worldMap, myClusterData) {
    let score = 0;
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'self', 'COM-').length === 1) {
                if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_adj', '').length > 0) {
                    score += 1;
                    if ((0, score_1.GetNeighbor)(worldMap, { x: x, y: y }, 'all_cross', '').length > 0) {
                        score += 1;
                    }
                }
            }
        }
    }
    return score;
}
exports.ScoreSO17B = ScoreSO17B;
function ScoreSO18B(worldMap, myClusterData) {
    let score = 0;
    score += Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'COL', '1d_list_lengths'));
    score += Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, 'ROW', '1d_list_lengths'));
    return score;
}
exports.ScoreSO18B = ScoreSO18B;
