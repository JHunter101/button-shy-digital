import { Coordinate, ClusterData } from './types';

// Helpers
function GetColumns(worldMap: string[][]): Coordinate[][] {
  const columnClusters: Coordinate[][] = [];

  for (let x = 1; x < worldMap[0].length - 1; x++) {
    const cluster: Coordinate[] = [];
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

function GetRows(worldMap: string[][]): Coordinate[][] {
  const rowClusters: Coordinate[][] = [];
  for (let y = 1; y < worldMap[0].length - 1; y++) {
    const cluster: Coordinate[] = [];
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

export function GetNeighbor(
  worldMap: string[][],
  myCoord: Coordinate,
  toGet: string,
  toFind: string,
): Coordinate[] {
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

export function SmartRoadGetNeighbor(
  worldMap: string[][],
  myCoord: Coordinate,
  toFind: string,
  roadType = 'RD',
  roadToRoad = false,
): Coordinate[] {
  const y = myCoord.y;
  const x = myCoord.x;
  const output: Coordinate[] = [];
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

export function GetClustersData(worldMap: string[][]): ClusterData {
  const clusterData: ClusterData = {};
  const visited = new Set();
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (!(visited.has({ y: y, x: x }) || worldMap[y][x] === null)) {
        const cluster: Coordinate[] = [];
        const toVisit: Coordinate[] = [{ y: y, x: x }];
        const cType = worldMap[y][x].slice(0, 3);
        while (toVisit.length > 0) {
          const current: Coordinate = toVisit.pop() ?? { y: -1, x: -1 };
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
        } else {
          clusterData[cType].push(cluster);
        }
      }
    }
  }

  ['RD', 'RV'].forEach((cType) => {
    clusterData[cType] = [];
    const visited = new Set();
    for (let y = 1; y < worldMap.length - 1; y++) {
      for (let x = 1; x < worldMap.length - 1; x++) {
        if (!(visited.has({ y: y, x: x }) || worldMap[y][x] === null)) {
          continue;
        }

        const cluster: Coordinate[] = [];
        const toVisit: Coordinate[] = [{ y: y, x: x }];

        while (toVisit.length > 0) {
          const current: Coordinate = toVisit.pop() ?? { y: -1, x: -1 };
          if (visited.has(current)) {
            continue;
          }
          visited.add(current);
          const neighbors = SmartRoadGetNeighbor(
            worldMap,
            { y: current.y, x: current.x },
            '',
            'RD',
            true,
          );
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

export function GetClustersInfo(
  worldMap: string[][],
  myClusterData: ClusterData,
  cType: string,
  infoType: string,
): any[] {
  switch (infoType) {
    case '2d_list_coordinates': {
      return myClusterData[cType];
    }
    case '2d_list_values': {
      return GetClustersInfo(
        worldMap,
        myClusterData,
        cType,
        '2d_list_coordinates',
      ).map((sublist: Coordinate[]) =>
        sublist.map((myCoord) => worldMap[myCoord.y][myCoord.x]),
      );
    }
    case '1d_list_lengths': {
      return GetClustersInfo(
        worldMap,
        myClusterData,
        cType,
        '2d_list_coordinates',
      ).map((list: Coordinate[]) => list.length);
    }
    case '2d_list_longest': {
      const _2dListCoordinates = GetClustersInfo(
        worldMap,
        myClusterData,
        cType,
        '2d_list_coordinates',
      );
      const maxLength = _2dListCoordinates.reduce(
        (acc: number, curr: Coordinate[]) => Math.max(acc, curr.length),
        0,
      );
      return _2dListCoordinates.filter(
        (sublist: Coordinate[]) => sublist.length === maxLength,
      );
    }
    default: {
      return [];
    }
  }
}
