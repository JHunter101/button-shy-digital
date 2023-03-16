"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClustersInfo = exports.GetClustersData = exports.SmartRoadGetNeighbor = exports.GetNeighbor = void 0;
// Helpers
function GetColumns(worldMap) {
    const columnClusters = [];
    for (let x = 1; x < worldMap[0].length - 1; x++) {
        const cluster = [];
        for (let y = 1; x < worldMap[0].length - 1; y++) {
            if (worldMap[y][x] !== null && worldMap[y][x] !== '-') {
                cluster.push({ y: y, x: x });
            }
            if (cluster.length > 0) {
                columnClusters.push(cluster);
            }
        }
    }
    return columnClusters;
}
function GetRows(worldMap) {
    const rowClusters = [];
    for (let y = 1; y < worldMap[0].length - 1; y++) {
        const cluster = [];
        for (let x = 1; x < worldMap[0].length - 1; x++) {
            if (worldMap[y][x] !== null && worldMap[y][x] !== '-') {
                cluster.push({ y: y, x: x });
            }
            if (cluster.length > 0) {
                rowClusters.push(cluster);
            }
        }
    }
    return rowClusters;
}
function GetNeighbor(worldMap, myCoord, toGet, toFind) {
    const y = myCoord.y;
    const x = myCoord.x;
    switch (toGet) {
        // Self
        case 'self':
            return worldMap[y][x].includes(toFind) ? [myCoord] : [];
        // Multi
        case 'all_adj':
            return [
                ...GetNeighbor(worldMap, myCoord, 'N', toFind),
                ...GetNeighbor(worldMap, myCoord, 'E', toFind),
                ...GetNeighbor(worldMap, myCoord, 'S', toFind),
                ...GetNeighbor(worldMap, myCoord, 'W', toFind),
            ];
        case 'all_cross':
            return [
                ...GetNeighbor(worldMap, myCoord, 'NW', toFind),
                ...GetNeighbor(worldMap, myCoord, 'NE', toFind),
                ...GetNeighbor(worldMap, myCoord, 'SW', toFind),
                ...GetNeighbor(worldMap, myCoord, 'SE', toFind),
            ];
        case 'all_2x2':
            return [
                ...GetNeighbor(worldMap, myCoord, 'self', toFind),
                ...GetNeighbor(worldMap, myCoord, 'E', toFind),
                ...GetNeighbor(worldMap, myCoord, 'S', toFind),
                ...GetNeighbor(worldMap, myCoord, 'SE', toFind),
            ];
        // Single Direct
        case 'N':
            return worldMap[y - 1][x].includes(toFind) ? [{ y: y - 1, x: x }] : [];
        case 'E':
            return worldMap[y][x + 1].includes(toFind) ? [{ y: y, x: x + 1 }] : [];
        case 'S':
            return worldMap[y + 1][x].includes(toFind) ? [{ y: y + 1, x: x }] : [];
        case 'W':
            return worldMap[y][x - 1].includes(toFind) ? [{ y: y, x: x - 1 }] : [];
        // Single Corner
        case 'NW':
            return worldMap[y - 1][x - 1].includes(toFind)
                ? [{ y: y - 1, x: x - 1 }]
                : [];
        case 'NE':
            return worldMap[y - 1][x + 1].includes(toFind)
                ? [{ y: y - 1, x: x + 1 }]
                : [];
        case 'SW':
            return worldMap[y + 1][x - 1].includes(toFind)
                ? [{ y: y + 1, x: x - 1 }]
                : [];
        case 'SE':
            return worldMap[y + 1][x + 1].includes(toFind)
                ? [{ y: y + 1, x: x + 1 }]
                : [];
        // Default
        default:
            return [];
    }
}
exports.GetNeighbor = GetNeighbor;
function SmartRoadGetNeighbor(worldMap, myCoord, toFind, roadType = 'RD', roadToRoad = false) {
    const y = myCoord.y;
    const x = myCoord.x;
    const output = [];
    if (worldMap[y][x].includes('-' + roadType + 'N-')) {
        if (roadToRoad) {
            toFind = '-' + roadType + 's-';
        }
        output.concat(GetNeighbor(worldMap, myCoord, 'N', toFind));
    }
    if (worldMap[y][x].includes('-' + roadType + 'E-')) {
        if (roadToRoad) {
            toFind = '-' + roadType + 's-';
        }
        output.concat(GetNeighbor(worldMap, myCoord, 'E', toFind));
    }
    if (worldMap[y][x].includes('-' + roadType + 'S-')) {
        if (roadToRoad) {
            toFind = '-' + roadType + 's-';
        }
        output.concat(GetNeighbor(worldMap, myCoord, 'S', toFind));
    }
    if (worldMap[y][x].includes('-' + roadType + 'W-')) {
        if (roadToRoad) {
            toFind = '-' + roadType + 's-';
        }
        output.concat(GetNeighbor(worldMap, myCoord, 'W', toFind));
    }
    return output;
}
exports.SmartRoadGetNeighbor = SmartRoadGetNeighbor;
function GetClustersData(worldMap) {
    var _a;
    const clusterData = {};
    const visited = new Set();
    for (let y = 1; y < worldMap.length - 1; y++) {
        for (let x = 1; x < worldMap.length - 1; x++) {
            if (!(visited.has({ y: y, x: x }) || worldMap[y][x] === null)) {
                const cluster = [];
                const toVisit = [{ y: y, x: x }];
                const cType = worldMap[y][x].slice(0, 3);
                while (toVisit.length > 0) {
                    const current = (_a = toVisit.pop()) !== null && _a !== void 0 ? _a : { y: -1, x: -1 };
                    if (visited.has(current)) {
                        continue;
                    }
                    visited.add(current);
                    if (worldMap[current.y][current.x].includes(cType)) {
                        cluster.push(current);
                        toVisit.push({ y: current.y - 1, x: current.x });
                        toVisit.push({ y: current.y, x: current.x + 1 });
                        toVisit.push({ y: current.y + 1, x: current.x });
                        toVisit.push({ y: current.y, x: current.x - 1 });
                    }
                }
                if (!(cType in clusterData)) {
                    clusterData[cType] = [];
                }
                else {
                    clusterData[cType].push(cluster);
                }
            }
        }
    }
    ['RD', 'RV'].forEach((cType) => {
        var _a;
        clusterData[cType] = [];
        const visited = new Set();
        for (let y = 1; y < worldMap.length - 1; y++) {
            for (let x = 1; x < worldMap.length - 1; x++) {
                if (!(visited.has({ y: y, x: x }) || worldMap[y][x] === null)) {
                    continue;
                }
                const cluster = [];
                const toVisit = [{ y: y, x: x }];
                while (toVisit.length > 0) {
                    const current = (_a = toVisit.pop()) !== null && _a !== void 0 ? _a : { y: -1, x: -1 };
                    if (visited.has(current)) {
                        continue;
                    }
                    visited.add(current);
                    const neighbors = SmartRoadGetNeighbor(worldMap, { y: current.y, x: current.x }, '', 'RD', true);
                    cluster.concat(neighbors);
                    toVisit.concat(neighbors);
                }
                clusterData[cType].push(cluster);
            }
        }
    });
    clusterData.ROW = GetRows(worldMap);
    clusterData.COL = GetColumns(worldMap);
    return clusterData;
}
exports.GetClustersData = GetClustersData;
function GetClustersInfo(worldMap, myClusterData, cType, infoType) {
    switch (infoType) {
        case '2d_list_coordinates': {
            return myClusterData[cType];
        }
        case '2d_list_values': {
            return GetClustersInfo(worldMap, myClusterData, cType, '2d_list_coordinates').map((sublist) => sublist.map((myCoord) => worldMap[myCoord.y][myCoord.x]));
        }
        case '1d_list_lengths': {
            return GetClustersInfo(worldMap, myClusterData, cType, '2d_list_coordinates').map((list) => list.length);
        }
        case '2d_list_longest': {
            const _2dListCoordinates = GetClustersInfo(worldMap, myClusterData, cType, '2d_list_coordinates');
            const maxLength = _2dListCoordinates.reduce((acc, curr) => Math.max(acc, curr.length), 0);
            return _2dListCoordinates.filter((sublist) => sublist.length === maxLength);
        }
        default: {
            return [];
        }
    }
}
exports.GetClustersInfo = GetClustersInfo;
