const { GetClustersInfo, SmartRoadGetNeighbor, GetNeighbor } = require('./score.js')

function ScoreSO01B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (SmartRoadGetNeighbor(worldMap, x, y, null, 'RD', false)
        .length > 0) {
        score -= 1
      } else {
        score += 1
      }
    }
  }
  return score
}

function ScoreSO02B (worldMap, clusterData) {
  let score = 0
  const toCheck = GetClustersInfo(worldMap, clusterData, 'COL', '2d_list_values') + GetClustersInfo(worldMap, clusterData, 'ROW', '2d_list_values')
  toCheck.forEach(cluster => {
    if (cluster.filter(value => value.includes('-PAR'))
      .length === 3) {
      score += 1
    } else if (cluster.filter(value => value.includes('-PAR'))
      .length === 0) {
      score -= 3
    }
  })
  return score
}

function ScoreSO03B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      score += (GetNeighbor(worldMap, x, y, 'self', 'PAR-')
        .length === 1)
        ? 1
        : (GetNeighbor(worldMap, x, y, 'self', 'IND-')
            .length === 1)
            ? -3
            : 0
    }
  }
  return score
}

function ScoreSO04B (worldMap, clusterData) {
  let score = -8

  for (let y = 1; y < worldMap.length - 1; y++) {
    if (score === 7) {
      break
    }
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (score === 7) {
        break
      }

      if (GetNeighbor(worldMap, x, y, 'all_2x2', worldMap[y][x].slice(0, 3))
        .length === 4) {
        score += 3
      }
    }
  }
  return score
}

function ScoreSO05B (worldMap, clusterData) {
  let score = 0

  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'IND-')
        .length === 1) {
        if (GetNeighbor(worldMap, x, y, 'all_adj', 'IND-')
          .length + (GetNeighbor(worldMap, x, y, 'all_adj', 'COM-')
          .length === 4)) {
          score += 2
        }
      }
    }
  }

  return score
}

function ScoreSO06B (worldMap, clusterData) {
  let score = 0
  score += Math.Math.max(GetClustersInfo(worldMap, clusterData, 'RES', '1d_list_lengths'))
  score -= Math.Math.max(GetClustersInfo(worldMap, clusterData, 'IND', '1d_list_lengths'))
  return score
}

function ScoreSO07B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'PAR-')
        .length === 1) {
        if (GetNeighbor(worldMap, x, y, 'all_adj', null)
          .length === 0) {
          score += 1
        } else {
          score -= 2
        }
      }
    }
  }

  return score
}

function ScoreSO08B (worldMap, clusterData) {
  const scores = []
  const _2dListLongest = GetClustersInfo(worldMap, clusterData, 'RES', '2d_list_longest')

  _2dListLongest.forEach(cluster => {
    let score = 0
    const parks = {}
    const inds = {}
    cluster.forEach(([y, x]) => {
      GetNeighbor(worldMap, x, y, 'self', 'PAR-')
        .forEach(coord => {
          if (!parks[coord]) {
            parks[coord] = 1
            score += 1
          }
        })

      GetNeighbor(worldMap, x, y, 'self', 'IND-')
        .forEach(coord => {
          if (!inds[coord]) {
            inds[coord] = 1
            score -= 3
          }
        })
    })
    scores.push(score)
  })

  return Math.max(scores)
}

function ScoreSO09B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'IND-')
        .length === 1) {
        if (GetNeighbor(worldMap, x, y, 'all_cross', 'IND-')
          .length > 0) {
          score += 1
        }
      }
    }
  }

  return score
}

function ScoreSO10B (worldMap, clusterData) {
  let score = 0
  const toCheck = GetClustersInfo(worldMap, clusterData, 'COL', '2d_list_values') + GetClustersInfo(worldMap, clusterData, 'ROW', '2d_list_values')
  score = Math.max(toCheck.map(cluster =>
    (cluster.filter(value => value.includes('-COM')
      .length()))
  ))
  return score
}

function ScoreSO11B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'COM-')
        .length === 1) {
        if (SmartRoadGetNeighbor(worldMap, x, y, null, 'RD', true)
          .filter(coord => GetNeighbor(worldMap, coord[0], coord[1], 'self', 'RES-')
            .length === 1)
          .length > 2) {
          score += 2
        }
      }
    }
  }
  return score
}

function ScoreSO12B (worldMap, clusterData) {
  let score = 0
  score = Math.max(GetClustersInfo(worldMap, clusterData, 'RD', '1d_list_lengths')) / 2
  return score
}

function ScoreSO13B (worldMap, clusterData) {
  let score = 0
  GetClustersInfo(worldMap, clusterData, 'RD', '2d_list_coords')
    .forEach(cluster => {
      if (cluster.filter(coord => SmartRoadGetNeighbor(worldMap, coord[0], coord[1], null, 'RD', true)
        .length === 1)
        .filter(coord => GetNeighbor(worldMap, coord[0], coord[1], 'self', 'PAR-')
          .length === 1)
        .length === 2) {
        score += 3
      }
    })
  return score
}

function ScoreSO14B (worldMap, clusterData) {
  let score = 0
  score = GetClustersInfo(worldMap, clusterData, 'RD', '2d_list_coords')
    .filter(cluster => cluster.filter(coord => SmartRoadGetNeighbor(worldMap, coord[0], coord[1], null, 'RD', true)
      .length < 2)
      .length > 0)
    .map(cluster => cluster.length)
    .reduce((partialSum, a) => partialSum + a, 0)
  return score
}

function ScoreSO15B (worldMap, clusterData) {
  let score = 0
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'RES-')
        .length === 1) {
        if (GetNeighbor(worldMap, x, y, 'all_adj', 'IND-')
          .length >= 2) {
          score += 2
        }
      }
    }
  }
  return score
}

function ScoreSO16B (worldMap, clusterData) {
  let score = 0

  score = GetClustersInfo(worldMap, clusterData, 'RD', '2d_list_coords')
    .filter(cluster => cluster.filter(coord => GetNeighbor(worldMap, coord[0], coord[1], 'RES')
      .length > 0 && cluster.filter(coord => GetNeighbor(worldMap, coord[0], coord[1], 'COM')
      .length > 0))) * 2

  return score
}

function ScoreSO17B (worldMap, clusterData) {
  let score = 0

  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (GetNeighbor(worldMap, x, y, 'self', 'COM-')
        .length === 1) {
        if (GetNeighbor(worldMap, x, y, 'all_adj', null)
          .length > 0) {
          score += 1
          if (GetNeighbor(worldMap, x, y, 'all_cross', null)
            .length > 0) {
            score += 1
          }
        }
      }
    }
  }

  return score
}

function ScoreSO18B (worldMap, clusterData) {
  let score = 0
  score += Math.max(GetClustersInfo(worldMap, clusterData, 'COL', '1d_list_lengths'))
  score += Math.max(GetClustersInfo(worldMap, clusterData, 'ROW', '1d_list_lengths'))
  return score
}

module.exports = { ScoreSO01B, ScoreSO02B, ScoreSO03B, ScoreSO04B, ScoreSO05B, ScoreSO06B, ScoreSO07B, ScoreSO08B, ScoreSO09B, ScoreSO10B, ScoreSO11B, ScoreSO12B, ScoreSO13B, ScoreSO14B, ScoreSO15B, ScoreSO16B, ScoreSO17B, ScoreSO18B }
