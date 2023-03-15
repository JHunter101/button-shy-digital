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

function GetClustersData (worldMap) {
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
    const visited = new Set()
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

function GetClustersInfo (worldMap, clusterData, cType, infoType) {
  switch (infoType) {
    case '2d_list_coordinates': {
      return clusterData[cType]
    }
    case '2d_list_values': {
      return GetClustersInfo(worldMap, cType, '2d_list_coordinates')
        .map(sublist => sublist.map(coord => worldMap[coord[0]][coord[1]]))
    }
    case '1d_list_lengths': {
      return GetClustersInfo(worldMap, cType, '2d_list_coordinates')
        .map(list => list.length)
    }
    case '2d_list_longest': {
      const _2dListCoordinates = GetClustersInfo(worldMap, cType, '2d_list_coordinates')
      const maxLength = _2dListCoordinates.reduce((acc, curr) => Math.Math.max(acc, curr.length), 0)
      return _2dListCoordinates.filter(sublist => sublist.length === maxLength)
    }
  }
}

module.exports = { GetClustersData, GetClustersInfo }
