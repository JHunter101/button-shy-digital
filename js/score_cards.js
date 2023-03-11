// Helpers
function GetColumns (worldMap) {
  return worldMap[0].map((_, col) =>
    worldMap.reduce((columnValues, rowValues, row) =>
      rowValues[col] !== null
        ? columnValues.concat([
          [row, col]
        ])
        : columnValues,
    [])
  )
    .filter(columnValues => columnValues.length > 0)
}

function GetRows (worldMap) {
  return worldMap.map((rowValues, row) =>
    rowValues.reduce((rowCoords, cellValue, col) =>
      cellValue !== null
        ? rowCoords.concat([
          [row, col]
        ])
        : rowCoords,
    [])
  )
    .filter(rowCoords => rowCoords.length > 0)
}

function GetNeighbor (worldMap, x, y, direction, target) {
  switch (direction) {
    // Self
    case 'self':
      return worldMap[y][x].includes(target)
        ? [
            [y, x]
          ]
        : []

      // Multi
    case 'all_adj':
      return GetNeighbor(worldMap, x, y, 'N', target) + GetNeighbor(worldMap, x, y, 'E', target) + GetNeighbor(worldMap, x, y, 'S', target) + GetNeighbor(worldMap, x, y, 'W', target)

    case 'all_cross':
      return GetNeighbor(worldMap, x, y, 'NW', target) + GetNeighbor(worldMap, x, y, 'NE', target) + GetNeighbor(worldMap, x, y, 'SW', target) + GetNeighbor(worldMap, x, y, 'SE', target)

    case 'all_2x2':
      return GetNeighbor(worldMap, x, y, 'self', target) + GetNeighbor(worldMap, x, y, 'E', target) + GetNeighbor(worldMap, x, y, 'S', target) + GetNeighbor(worldMap, x, y, 'SE', target)

      // Single Direct
    case 'N':
      return worldMap[y - 1][x].includes(target)
        ? [
            [y - 1, x]
          ]
        : []
    case 'E':
      return worldMap[y][x + 1].includes(target)
        ? [
            [y, x + 1]
          ]
        : []
    case 'S':
      return worldMap[y + 1][x].includes(target)
        ? [
            [y + 1, x]
          ]
        : []
    case 'W':
      return worldMap[y][x - 1].includes(target)
        ? [
            [y, x - 1]
          ]
        : []

      // Single Corner
    case 'NW':
      return worldMap[y - 1][x - 1].includes(target)
        ? [
            [y - 1, x - 1]
          ]
        : []
    case 'NE':
      return worldMap[y - 1][x + 1].includes(target)
        ? [
            [y - 1, x + 1]
          ]
        : []
    case 'SW':
      return worldMap[y + 1][x - 1].includes(target)
        ? [
            [y + 1, x - 1]
          ]
        : []
    case 'SE':
      return worldMap[y + 1][x + 1].includes(target)
        ? [
            [y + 1, x + 1]
          ]
        : []

      // Default
    default:
      return []
  }
}

function SmartRoadGetNeighbor (worldMap, x, y, target, roadType = 'RD', roadToRoad = false) {
  let output = []
  if (worldMap[y][x].includes('-' + roadType + 'N-')) {
    if (roadToRoad) {
      target = '-' + roadType + 's-'
    }
    output += GetNeighbor(worldMap, x, y, 'N', target)
  }
  if (worldMap[y][x].includes('-' + roadType + 'E-')) {
    if (roadToRoad) {
      target = '-' + roadType + 's-'
    }
    output += GetNeighbor(worldMap, x, y, 'E', target)
  }
  if (worldMap[y][x].includes('-' + roadType + 'S-')) {
    if (roadToRoad) {
      target = '-' + roadType + 's-'
    }
    output += GetNeighbor(worldMap, x, y, 'S', target)
  }
  if (worldMap[y][x].includes('-' + roadType + 'W-')) {
    if (roadToRoad) {
      target = '-' + roadType + 's-'
    }
    output += GetNeighbor(worldMap, x, y, 'W', target)
  }
  return output
}

function getClustersData (worldMap) {
  const clusterData = {}
  const visited = Set()
  for (let y = 1; y < worldMap.length - 1; y++) {
    for (let x = 1; x < worldMap.length - 1; x++) {
      if (visited.includes([y, x]) || worldMap[y][x] === null) {
        continue
      }
      const cluster = []
      const toVisit = [
        [y, x]
      ]
      const cType = worldMap[y][x].slice(0, 3)
      if (!(cType in clusterData)) {
        clusterData[cType] = []
      }

      while (toVisit.length > 0) {
        const current = toVisit.pop()
        if (visited.includes(current)) {
          continue
        }
        visited.add(current)

        if (worldMap[current[0]][current[1]].includes(cType)) {
          cluster.push(current)
          toVisit.push([current[0] - 1, current[1]])
          toVisit.push([current[0], current[1] + 1])
          toVisit.push([current[0] + 1, current[1]])
          toVisit.push([current[0], current[1] - 1])
        }
      }

      clusterData[cType].push(cluster)
    }
  }

  ['RD', 'RV'].forEach(cType => {
    clusterData[cType] = []
    const visited = set()
    for (let y = 1; y < worldMap.length - 1; y++) {
      for (let x = 1; x < worldMap.length - 1; x++) {
        if (visited.includes([y, x]) || worldMap[y][x] === null) {
          continue
        }

        let cluster = []
        let toVisit = [
          [y, x]
        ]

        while (toVisit.length > 0) {
          const current = toVisit.pop()
          if (visited.includes(current)) {
            continue
          }
          visited.add(current)
          const neighbors = SmartRoadGetNeighbor(worldMap, current[0], current[1], null, 'RD', true)
          cluster += neighbors
          toVisit += neighbors
        }

        clusterData[cType].push(cluster)
      }
    }
  })

  clusterData.ROW = GetRows(worldMap)
  clusterData.COL = GetColumns(worldMap)

  return clusterData
}

function getClusterInfo (worldMap, clusterData, cType, infoType) {
  switch (infoType) {
    case '2d_list_coordinates': {
      return clusterData[cType]
    }
    case '2d_list_values': {
      return getClusterInfo(worldMap, cType, '2d_list_coordinates')
        .map(sublist => sublist.map(coord => worldMap[coord[0]][coord[1]]))
    }
    case '1d_list_lengths': {
      return getClusterInfo(worldMap, cType, '2d_list_coordinates')
        .map(list => list.length)
    }
    case '2d_list_longest': {
      const _2dListCoordinates = getClusterInfo(worldMap, cType, '2d_list_coordinates')
      const maxLength = _2dListCoordinates.reduce((acc, curr) => Math.Math.max(acc, curr.length), 0)
      return _2dListCoordinates.filter(sublist => sublist.length === Math.maxLength)
    }
  }
}

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
  const toCheck = getClusterInfo(worldMap, clusterData, 'COL', '2d_list_values') + getClusterInfo(worldMap, clusterData, 'ROW', '2d_list_values')
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
  score += Math.Math.max(getClusterInfo(worldMap, clusterData, 'RES', '1d_list_lengths'))
  score -= Math.Math.max(getClusterInfo(worldMap, clusterData, 'IND', '1d_list_lengths'))
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
  const _2dListLongest = getClusterInfo(worldMap, clusterData, 'RES', '2d_list_longest')

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
  const toCheck = getClusterInfo(worldMap, clusterData, 'COL', '2d_list_values') + getClusterInfo(worldMap, clusterData, 'ROW', '2d_list_values')
  score = Math.max(toCheck.map(cluster => {
    cluster.filter(value => value.includes('-COM')
      .length())
  }))
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
  score = Math.max(getClusterInfo(worldMap, clusterData, 'RD', '1d_list_lengths')) / 2
  return score
}

function ScoreSO13B (worldMap, clusterData) {
  let score = 0
  getClusterInfo(worldMap, clusterData, 'RD', '2d_list_coords')
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
  score = getClusterInfo(worldMap, clusterData, 'RD', '2d_list_coords')
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

  score = getClusterInfo(worldMap, clusterData, 'RD', '2d_list_coords')
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
  score += Math.max(getClusterInfo(worldMap, clusterData, 'COL', '1d_list_lengths'))
  score += Math.max(getClusterInfo(worldMap, clusterData, 'ROW', '1d_list_lengths'))
  return score
}
