// Borrowed Functions
import { GetClusterData, GetClustersInfo } from './score_cards.js'

// Global Vars
const ROTATION_TRANSLATION = {
  RDN: 'RDS',
  RDE: 'RDW',
  RDS: 'RDN',
  RDW: 'RDE',
  RVN: 'RDS',
  RVE: 'RDW',
  RVS: 'RDN',
  RVW: 'RDE',
  CPN: 'RDS',
  CPE: 'RDW',
  CPS: 'RDN',
  CPW: 'RDE'
}

// general functions
function Rotate180 (arr) {
  function Rtl (tileCode) {
    const tileCodeChunks = tileCode.split('-')
    const newCode = tileCodeChunks.map(part => ROTATION_TRANSLATION[part] || part)
    return newCode.join('-')
  }
  return [
    [Rtl(arr[1][1]), Rtl(arr[1][0])],
    [Rtl(arr[0][1]), Rtl(arr[0][0])]
  ]
}

function FlipCard (cid) {
  if (cid.slice(-1) === 'A') {
    cid = cid.slice(0, -1) + 'B'
  } else if (cid.slice(-1) === 'B') {
    cid = cid.slice(0, -1) + 'A'
  }
  return cid
}

function play (mapSize = 9, rounds = 15) {
  // Play functions
  function DrawCard (cardsAvailable) {
    const i = Math.floor(Math.random() * cardsAvailable.length)
    const card = cardsAvailable[i]
    cardsAvailable.splice(i, 1)
    return card
  }

  // SETUP GAME
  function setup () {
    function InitWorldMap (mapSize = 9, targetScore = 0) {
      worldMap.push([
        ['-'].concat([...Array(mapSize).keys()].map(i => i + 1))
      ].concat(['-']))
      for (let i = 0; i < mapSize; i++) {
        worldMap.push([i + 1].concat(Array(mapSize).fill(null)).concat([i + 1]))
      }
      worldMap.push([
        ['-'].concat([...Array(mapSize).keys()].map(i => i + 1))
      ].concat(['-']))

      return worldMap
    }

    // Setup Map
    let worldMap = InitWorldMap(mapSize)

    // Init Deck Piles
    const cardsAvailable = []
    const cardsGoal = []
    const cardsHand = []
    let allowedCoords = []

    // Init Scores
    const finalScore = 0
    let targetScore = 0

    // Draw Goal Cards
    for (let i = 0; i < 3; i++) {
      const card = FlipCard(DrawCard(cardsAvailable))
      cardsGoal.push(card)
      targetScore += parseInt(card.slice(1, 3))
    }

    // Draw Hand Cards
    for (let i = 0; i < 3; i++) {
      const card = DrawCard(cardsAvailable)
      cardsHand.push(card)
    }

    [worldMap, allowedCoords] = PlayCard(worldMap, DrawCard(), (mapSize - 1) / 2, (mapSize - 1) / 2, allowedCoords)

    return (cardsAvailable, cardsGoal, cardsHand, allowedCoords, worldMap, finalScore, targetScore)
  }

  // Main Game Loop
  function PlayCard (worldMap, card, x, y, allowedCoords) {
    if (allowedCoords.some(coord => coord[0] === x && coord[1] === y)) {
      worldMap[x][y] = card[0][0]
      worldMap[x][y + 1] = card[0][1]
      worldMap[x + 1][y] = card[1][0]
      worldMap[x + 1][y + 1] = card[1][1]
      allowedCoords = CalculateAllowed(allowedCoords, x, y)
    }
    return (worldMap, allowedCoords)
  }

  function CalculateAllowed (allowedCoords, x, y) {
    for (let dy = -1; dy < 3; dy++) {
      for (let dx = -1; dx < 3; dx++) {
        if (![
          [-1, -1],
          [-1, 2],
          [2, -1],
          [2, 2]
        ].some(([cy, cx]) => cy === dy && cx === dx)) {
          allowedCoords.add(String(y + dy), String(x + dx))
        }
      }
    }
    return allowedCoords
  }

  // Evaluate Score
  function EvaluateScore (worldMap, cardsGoal) {
    const clusterData = GetClusterData(worldMap)

    function ScoreBlocks (worldMap) {
      let score = 0
      const myBlockTypes = ['PAR', 'RES', 'COM', 'IND']
      myBlockTypes.forEach(cType => {
        score += Math.max(GetClustersInfo(worldMap, clusterData, cType, '1d_list_lengths'))
      })
      return score
    };

    function ScoreRoads (worldMap) {
      let score = 0
      score -= GetClustersInfo(worldMap, clusterData, 'RD', '1d_list_lengths').length()
      return score
    };

    function ScoreGoal (worldMap, goal) {
      return eval(goal + '(worldMap)')
    };

    const scoreBlock = ScoreBlocks(worldMap)
    const scoreRoad = ScoreRoads(worldMap)

    cardsGoal.map(goal => ScoreGoal(worldMap, goal))

    return [scoreBlock] + [scoreRoad] + cardsGoal
  }

  let [cardsAvailable, cardsGoal, cardsHand, allowedCoords, worldMap, finalScore, targetScore] = setup()
  while (rounds > 0) {
    // pick a x y
    const x = 1
    const y = 1

    cardsHand = DrawCard(cardsAvailable)
    const [worldMap, allowedCoords] = PlayCard(worldMap, cardsHand[0], x, y, allowedCoords)
    rounds -= 1
  }

  finalScore = EvaluateScore(worldMap, cardsGoal, targetScore)

  if (finalScore >= targetScore) {
    console.log('You win!')
  }
  return (worldMap, finalScore, targetScore)
}

const [worldMap, finalScore, targetScore] = play(9, 15)
