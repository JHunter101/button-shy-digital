import { GetClustersInfo, SmartRoadGetNeighbor, GetNeighbor } from './score';
import { Coordinate, Card, StringTranslation, ClusterData } from './types';

export function ScoreSO01B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (
        SmartRoadGetNeighbor(worldMap, { x: x, y: y }, '', 'RD', false).length >
        0
      ) {
        score -= 1;
      } else {
        score += 1;
      }
    }
  }
  return score;
}

export function ScoreSO02B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  const toCheck = GetClustersInfo(
    worldMap,
    myClusterData,
    'COL',
    '2d_list_values',
  ).concat(GetClustersInfo(worldMap, myClusterData, 'ROW', '2d_list_values'));
  toCheck.forEach((cluster: string[]) => {
    if (cluster.filter((value) => value.includes('-PAR')).length === 3) {
      score += 1;
    } else if (cluster.filter((value) => value.includes('-PAR')).length === 0) {
      score -= 3;
    }
  });
  return score;
}

export function ScoreSO03B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      score +=
        GetNeighbor(worldMap, { x: x, y: y }, 'self', 'PAR-').length === 1
          ? 1
          : GetNeighbor(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1
          ? -3
          : 0;
    }
  }
  return score;
}

export function ScoreSO04B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = -8;

  for (let y = 1; y < worldMap.length - 1; y++) {
    if (score === 7) {
      break;
    }
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (score === 7) {
        break;
      }

      if (
        GetNeighbor(
          worldMap,
          { x: x, y: y },
          'all_2x2',
          worldMap[y][x].slice(0, 3),
        ).length === 4
      ) {
        score += 3;
      }
    }
  }
  return score;
}

export function ScoreSO05B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;

  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1) {
        if (
          GetNeighbor(worldMap, { x: x, y: y }, 'all_adj', 'IND-').length +
            GetNeighbor(worldMap, { x: x, y: y }, 'all_adj', 'COM-').length ===
          4
        ) {
          score += 2;
        }
      }
    }
  }

  return score;
}

export function ScoreSO06B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  score += Math.max(
    ...GetClustersInfo(worldMap, myClusterData, 'RES', '1d_list_lengths'),
  );
  score -= Math.max(
    ...GetClustersInfo(worldMap, myClusterData, 'IND', '1d_list_lengths'),
  );
  return score;
}

export function ScoreSO07B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'PAR-').length === 1) {
        if (GetNeighbor(worldMap, { x: x, y: y }, 'all_adj', '').length === 0) {
          score += 1;
        } else {
          score -= 2;
        }
      }
    }
  }

  return score;
}

export function ScoreSO08B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  const scores: number[] = [];
  const _2dListLongest = GetClustersInfo(
    worldMap,
    myClusterData,
    'RES',
    '2d_list_longest',
  );

  _2dListLongest.forEach((cluster) => {
    let score = 0;
    const parks: Set<Coordinate> = new Set();
    const inds: Set<Coordinate> = new Set();
    cluster.forEach((myCoord: Coordinate) => {
      GetNeighbor(worldMap, myCoord, 'self', 'PAR-').forEach((theirCoord) => {
        if (!parks.has(theirCoord)) {
          parks.add(theirCoord);
          score += 1;
        }
      });

      GetNeighbor(worldMap, myCoord, 'self', 'IND-').forEach((theirCoord) => {
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

export function ScoreSO09B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'IND-').length === 1) {
        if (
          GetNeighbor(worldMap, { x: x, y: y }, 'all_cross', 'IND-').length > 0
        ) {
          score += 1;
        }
      }
    }
  }

  return score;
}

export function ScoreSO10B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  const toCheck = [
    ...GetClustersInfo(worldMap, myClusterData, 'COL', '2d_list_values'),
    ...GetClustersInfo(worldMap, myClusterData, 'ROW', '2d_list_values'),
  ];
  score = Math.max(
    ...toCheck.map((cluster) =>
      cluster.filter((value: string) => value.includes('-COM')).length(),
    ),
  );
  return score;
}

export function ScoreSO11B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'COM-').length === 1) {
        if (
          SmartRoadGetNeighbor(worldMap, { x: x, y: y }, '', 'RD', true).filter(
            (myCoord) =>
              GetNeighbor(
                worldMap,
                { x: myCoord.x, y: myCoord.y },
                'self',
                'RES-',
              ).length === 1,
          ).length > 2
        ) {
          score += 2;
        }
      }
    }
  }
  return score;
}

export function ScoreSO12B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  score =
    Math.max(
      ...GetClustersInfo(worldMap, myClusterData, 'RD', '1d_list_lengths'),
    ) / 2;
  return score;
}

export function ScoreSO13B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  GetClustersInfo(worldMap, myClusterData, 'RD', '2d_list_coords').forEach(
    (cluster) => {
      if (
        cluster
          .filter(
            (myCoord: Coordinate) =>
              SmartRoadGetNeighbor(
                worldMap,
                { x: myCoord.x, y: myCoord.y },
                '',
                'RD',
                true,
              ).length === 1,
          )
          .filter(
            (myCoord: Coordinate) =>
              GetNeighbor(
                worldMap,
                { x: myCoord.x, y: myCoord.y },
                'self',
                'PAR-',
              ).length === 1,
          ).length === 2
      ) {
        score += 3;
      }
    },
  );
  return score;
}

export function ScoreSO14B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  score = GetClustersInfo(worldMap, myClusterData, 'RD', '2d_list_coords')
    .filter(
      (cluster) =>
        cluster.filter(
          (myCoord: Coordinate) =>
            SmartRoadGetNeighbor(
              worldMap,
              { x: myCoord.x, y: myCoord.y },
              '',
              'RD',
              true,
            ).length < 2,
        ).length > 0,
    )
    .map((cluster) => cluster.length)
    .reduce((partialSum, a) => partialSum + a, 0);
  return score;
}

export function ScoreSO15B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'RES-').length === 1) {
        if (
          GetNeighbor(worldMap, { x: x, y: y }, 'all_adj', 'IND-').length >= 2
        ) {
          score += 2;
        }
      }
    }
  }
  return score;
}

export function ScoreSO16B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;

  score =
    GetClustersInfo(worldMap, myClusterData, 'RD', '2d_list_coords').filter(
      (cluster: Coordinate[]) =>
        cluster.filter(
          (coord: Coordinate) =>
            GetNeighbor(worldMap, { x: coord.x, y: coord.y }, 'self', 'RES')
              .length > 0,
        ).length > 0 &&
        cluster.filter(
          (innerCoord: Coordinate) =>
            GetNeighbor(
              worldMap,
              { x: innerCoord.x, y: innerCoord.y },
              'self',
              'COM',
            ).length > 0,
        ).length > 0,
    ).length * 2;

  return score;
}

export function ScoreSO17B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;

  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, { x: x, y: y }, 'self', 'COM-').length === 1) {
        if (GetNeighbor(worldMap, { x: x, y: y }, 'all_adj', '').length > 0) {
          score += 1;
          if (
            GetNeighbor(worldMap, { x: x, y: y }, 'all_cross', '').length > 0
          ) {
            score += 1;
          }
        }
      }
    }
  }

  return score;
}

export function ScoreSO18B(
  worldMap: string[][],
  myClusterData: ClusterData,
): number {
  let score = 0;
  score += Math.max(
    ...GetClustersInfo(worldMap, myClusterData, 'COL', '1d_list_lengths'),
  );
  score += Math.max(
    ...GetClustersInfo(worldMap, myClusterData, 'ROW', '1d_list_lengths'),
  );
  return score;
}
