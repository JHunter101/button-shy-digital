let fs = require('fs');
let csv = require('csv-parser');
const path = require('path');

const {
  ScoreSO01B,
  ScoreSO02B,
  ScoreSO03B,
  ScoreSO04B,
  ScoreSO05B,
  ScoreSO06B,
  ScoreSO07B,
  ScoreSO08B,
  ScoreSO09B,
  ScoreSO10B,
  ScoreSO11B,
  ScoreSO12B,
  ScoreSO13B,
  ScoreSO14B,
  ScoreSO15B,
  ScoreSO16B,
  ScoreSO17B,
  ScoreSO18B,
} = require('./SC_SO.js');
const { GetClustersData, GetClustersInfo } = require('./score.js');

module.exports = { Rotate180, PlayTurn };

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
  CPW: 'RDE',
};
const cardData = parseCSV(
  fs.readFileSync(path.join(__dirname, 'csv/card_list.csv'), 'utf8'),
  {
    headers: false,
    skip_empty_lines: true,
  },
);
const {
  worldMap,
  cardsGoal,
  targetScore,
  cardsHand,
  cardsAvailable,
  allowedCoords,
} = initGame();

/**
 * If the last character of the string is an 'A', replace it with a 'B', and if the last character of
 * the string is a 'B', replace it with an 'A'.
 * @param cid - The card ID.
 * @returns The card ID with the last character flipped.
 */
function FlipCard(cid) {
  if (cid.slice(-1) === 'A') {
    cid = `${cid.slice(0, -1)}B`;
  } else if (cid.slice(-1) === 'B') {
    cid = `${cid.slice(0, -1)}A`;
  }
  return cid;
}

/**
 * Draw a random card from the deck, and return the card and the deck with the card removed.
 * @param cardsAvailable - an array of cards that are available to be drawn
 * @returns An object with two properties: card and cardsAvailable.
 */
function DrawCard(cardsAvailable) {
  if (cardsAvailable.length === 0) {
    return [];
  }
  const i = Math.floor(Math.random() * cardsAvailable.length);
  const card = cardsAvailable[i];
  cardsAvailable.splice(i, 1);
  return { card, cardsAvailable };
}

/**
 * PlayCard takes a worldMap, a card, and two coordinates, and returns a worldMap with the card played
 * at the coordinates.
 * @param worldMap - The world map, a 2D array of strings.
 * @param card - a 2x2 array of strings
 * @param x - The x coordinate of the top left corner of the card.
 * @param y - 0
 * @returns The worldMap is being returned.
 */
function PlayCard(worldMap, card, x, y) {
  worldMap[x][y] = card[0][0];
  worldMap[x][y + 1] = card[0][1];
  worldMap[x + 1][y] = card[1][0];
  worldMap[x + 1][y + 1] = card[1][1];
  return worldMap;
}

/**
 * It takes a list of allowed coordinates, and a coordinate, and returns a list of allowed coordinates
 * that includes the coordinate and all of its neighbors.
 * @param allowedCoords - The array of allowed coordinates.
 * @param x - The x coordinate of the current cell
 * @param y - The y coordinate of the current cell
 * @returns An array of coordinates that are allowed to be used in the game.
 */
function CalculateAllowed(allowedCoords, x, y) {
  for (let dy = -1; dy < 3; dy++) {
    for (let dx = -1; dx < 3; dx++) {
      if (
        ![
          [-1, -1],
          [-1, 2],
          [2, -1],
          [2, 2],
        ].some(([cy, cx]) => cy === dy && cx === dx)
      ) {
        const coords = [y + dy, x + dx];
        if (
          !allowedCoords.some(
            ([cy, cx]) => cy === coords[0] && cx === coords[1],
          )
        ) {
          allowedCoords.push(coords);
        }
      }
    }
  }
  return allowedCoords;
}

/**
 * It creates a 2D array of size mapSize + 2, where the first and last rows are filled with '-' and the
 * first and last columns are filled with numbers from 1 to mapSize
 * @param [mapSize=9] - The size of the map.
 * @returns An object with the following properties:
 * - worldMap: A 2D array of size 11x11.
 * - cardsGoal: An array of 3 cards.
 * - targetScore: A number.
 * - cardsHand: An array of 3 cards.
 * - cardsAvailable: An array of cards.
 * - allowedCoords: An array of coordinates.
 */
function initGame(mapSize = 9) {
  /**
   * It creates a 2D array of size mapSize + 2, where the first and last rows are filled with '-' and
   * the first and last columns are filled with numbers from 1 to mapSize.
   * @param [mapSize=9] - The size of the map.
   * @returns A 2D array of size 11x11.
   */
  function InitWorldMap(mapSize = 9) {
    const worldMap = [];
    worldMap.push(
      ['-']
        .concat(Array.from(Array(mapSize).keys()).map((i) => i + 1))
        .concat(['-']),
    );

    for (let i = 0; i < mapSize; i++) {
      worldMap.push([i + 1].concat(Array(mapSize).fill(null)).concat([i + 1]));
    }
    worldMap.push(
      ['-']
        .concat(Array.from(Array(mapSize).keys()).map((i) => i + 1))
        .concat(['-']),
    );

    return worldMap;
  }

  let worldMap = InitWorldMap(mapSize);
  let cardsAvailable = cardData
    .filter((row) => row[1] === 'sprawlopolis')
    .map((row) => [
      [row[2], row[3]],
      [row[4], row[5]],
    ]);
  let cardsGoal = [];
  const cardsHand = [];
  let allowedCoords = [[(mapSize + 1) / 2, (mapSize + 1) / 2]];
  let targetScore = 0;

  for (let i = 0; i < 3; i++) {
    const newCardAndAvailable = DrawCard(cardsAvailable);
    let { card } = newCardAndAvailable;
    cardsAvailable = newCardAndAvailable.cardsAvailable;
    card = FlipCard(card);
    cardsGoal.push(card);
    targetScore += parseInt(card.slice(1, 3));
  }

  for (let i = 0; i < 3; i++) {
    const newCardAndAvailable = DrawCard(cardsAvailable);
    const { card } = newCardAndAvailable;
    cardsAvailable = newCardAndAvailable.cardsAvailable;
    cardsHand.push(card);
  }

  const newCardAndAvailable = DrawCard(cardsAvailable);
  const startCard = newCardAndAvailable.card;
  cardsAvailable = newCardAndAvailable.cardsAvailable;

  const newMapAndCoords = PlayTurn(
    (mapSize + 1) / 2,
    (mapSize + 1) / 2,
    startCard,
    worldMap,
    cardsGoal,
    targetScore,
    cardsHand,
    cardsAvailable,
    allowedCoords,
  );
  worldMap = newMapAndCoords.worldMap;
  allowedCoords = newMapAndCoords.allowedCoords;
  cardsGoal = newMapAndCoords.cardsGoal;
  targetScore = newMapAndCoords.targetScore;
  cardsAvailable = newMapAndCoords.cardsAvailable;

  return {
    worldMap,
    cardsGoal,
    targetScore,
    cardsHand,
    cardsAvailable,
    allowedCoords,
  };
}

/**
 * It takes a 2x2 array of tile codes, and returns a new 2x2 array of tile codes, where each tile code
 * has been rotated 180 degrees
 * @param hand - The hand of tiles.
 * @param i - the index of the tile in the hand
 * @returns A new array of arrays of strings.
 */
function Rotate180(hand, i) {
  function Rtl(tileCode) {
    const tileCodeChunks = tileCode.split('-');
    const newCode = tileCodeChunks.map(
      (part) => ROTATION_TRANSLATION[part] || part,
    );
    return newCode.join('-');
  }
  return [
    [Rtl(hand[i][1][1]), Rtl(hand[i][1][0])],
    [Rtl(hand[i][0][1]), Rtl(hand[i][0][0])],
  ];
}

/**
 * It takes in a bunch of stuff, and returns a bunch of stuff
 * @param y - The y coordinate of the card you want to play
 * @param x - The x coordinate of the card you want to play
 * @param picked - The card that was picked
 * @param worldMap - The current state of the world map.
 * @param cardsGoal - The goal cards for the game.
 * @param targetScore - The score you need to reach to win
 * @param cardsHand - The cards in the player's hand
 * @param cardsAvailable - An array of cards that can be drawn from.
 * @param allowedCoords - An array of coordinates that are allowed to be played on.
 * @returns An object with the following properties:
 * - worldMap
 * - cardsGoal
 * - targetScore
 * - cardsHand
 * - cardsAvailable
 * - allowedCoords
 */
function PlayTurn(
  y,
  x,
  picked,
  worldMap,
  cardsGoal,
  targetScore,
  cardsHand,
  cardsAvailable,
  allowedCoords,
) {
  if (allowedCoords.some((coord) => coord[0] === y && coord[1] === x)) {
    worldMap = PlayCard(worldMap, picked, x, y);
    allowedCoords = CalculateAllowed(allowedCoords, x, y);

    const newCardAndAvailable = DrawCard(cardsAvailable);
    cardsHand.push(newCardAndAvailable.card);
    cardsAvailable = newCardAndAvailable.cardsAvailable;

    if (cardsHand.length === 0) {
      const finalScore = EvaluateScore(worldMap, cardsGoal, targetScore);

      if (finalScore >= targetScore) {
        console.log('You win!');
      }
    }
  } else {
    // TODO: Handle this case
  }

  return {
    worldMap,
    cardsGoal,
    targetScore,
    cardsHand,
    cardsAvailable,
    allowedCoords,
  };
}

/**
 * It takes a worldMap and a list of goals, and returns a list of scores
 * @param worldMap - a 2D array of strings, where each string is a block type.
 * @param cardsGoal - ['SO01B', 'SO02B', 'SO03B', 'SO04B', 'SO05B', 'SO06B', 'SO07B', 'SO08B', 'SO09B',
 * 'SO10B', 'SO11B', 'SO12B',
 * @returns an array of numbers.
 */
function EvaluateScore(worldMap, cardsGoal) {
  const clusterData = GetClustersData(worldMap);

  /**
   * "For each of the four block types, get the length of the longest cluster of that type, and add
   * them all together."
   *
   * The function uses the `GetClustersInfo` function, which is defined in the next section
   * @param worldMap - a 2D array of strings, where each string is a block type.
   * @returns The score is being returned.
   */
  function ScoreBlocks(worldMap) {
    let score = 0;
    const myBlockTypes = ['PAR', 'RES', 'COM', 'IND'];
    myBlockTypes.forEach((cType) => {
      score += Math.max(
        GetClustersInfo(worldMap, clusterData, cType, '1d_list_lengths'),
      );
    });
    return score;
  }

  function ScoreRoads(worldMap) {
    let score = 0;
    score -= GetClustersInfo(
      worldMap,
      clusterData,
      'RD',
      '1d_list_lengths',
    ).length();
    return score;
  }

  /**
   * It takes a goal, and returns a function that takes a worldMap and clusterData and returns a score.
   * @param worldMap - a 2D array of numbers, where each number represents a country.
   * @param goal - string
   * @param clusterData -
   * @returns the value of the function that is being called.
   */
  function ScoreGoal(worldMap, goal, clusterData) {
    switch (goal) {
      case 'SO01B':
        return ScoreSO01B(worldMap, clusterData);
      case 'SO02B':
        return ScoreSO02B(worldMap, clusterData);
      case 'SO03B':
        return ScoreSO03B(worldMap, clusterData);
      case 'SO04B':
        return ScoreSO04B(worldMap, clusterData);
      case 'SO05B':
        return ScoreSO05B(worldMap, clusterData);
      case 'SO06B':
        return ScoreSO06B(worldMap, clusterData);
      case 'SO07B':
        return ScoreSO07B(worldMap, clusterData);
      case 'SO08B':
        return ScoreSO08B(worldMap, clusterData);
      case 'SO09B':
        return ScoreSO09B(worldMap, clusterData);
      case 'SO10B':
        return ScoreSO10B(worldMap, clusterData);
      case 'SO11B':
        return ScoreSO11B(worldMap, clusterData);
      case 'SO12B':
        return ScoreSO12B(worldMap, clusterData);
      case 'SO13B':
        return ScoreSO13B(worldMap, clusterData);
      case 'SO14B':
        return ScoreSO14B(worldMap, clusterData);
      case 'SO15B':
        return ScoreSO15B(worldMap, clusterData);
      case 'SO16B':
        return ScoreSO16B(worldMap, clusterData);
      case 'SO17B':
        return ScoreSO17B(worldMap, clusterData);
      case 'SO18B':
        return ScoreSO18B(worldMap, clusterData);
      default:
        throw new Error(`Unexpected value: ${'goal'}`);
    }
  }

  const scoreBlock = ScoreBlocks(worldMap);
  const scoreRoad = ScoreRoads(worldMap);

  cardsGoal.map((goal) => ScoreGoal(worldMap, goal, clusterData));

  return [scoreBlock] + [scoreRoad] + cardsGoal;
}

console.log({
  worldMap,
  cardsGoal,
  targetScore,
  cardsHand,
  cardsAvailable,
  allowedCoords,
});
