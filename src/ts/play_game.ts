// IMPORTS
import { Coordinate, Card, StringTranslation, ClusterData } from './types';
import { GetClustersInfo, GetClustersData } from './score';
import { cardData } from '../../res/ts/cardData';
import {
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
} from './SC_SO';

const ROTATION_TRANSLATION: StringTranslation = {
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

// EXPORT
export { Rotate180, PlayTurn };

// RUN

const {
  worldMap,
  cardsGoal,
  targetScore,
  cardsHand,
  cardsAvailable,
  allowedCoords,
} = initGame();

console.log({
  worldMap,
  cardsGoal,
  targetScore,
  cardsHand,
  cardsAvailable,
  allowedCoords,
});

function Rotate180(hand: Card[], i: number): Card[] {
  function Rtl(blockCode: string): string {
    const tileCodeChunks = blockCode.split('-');
    const newCode = tileCodeChunks.map(
      (part) => ROTATION_TRANSLATION[part] || part,
    );
    return newCode.join('-');
  }

  const card = hand[i];
  hand[i] = {
    ...card, // copy all properties from the original object
    nw: Rtl(card.nw),
    ne: Rtl(card.ne),
    sw: Rtl(card.sw),
    se: Rtl(card.se),
  };

  return hand;
}

function DrawCard(cardsAvailable: Card[]): {
  card: Card;
  cardsAvailable: Card[];
} {
  const i = Math.floor(Math.random() * cardsAvailable.length);
  const card = cardsAvailable[i];
  cardsAvailable.splice(i, 1);
  return { card, cardsAvailable };
}

function PlayCard(
  worldMap: string[][],
  myCard: Card,
  coord: Coordinate,
): string[][] {
  const x = coord.x;
  const y = coord.x;
  worldMap[x][y] = myCard.nw;
  worldMap[x][y + 1] = myCard.ne;
  worldMap[x + 1][y] = myCard.sw;
  worldMap[x + 1][y + 1] = myCard.se;
  return worldMap;
}

function CalculateAllowed(
  allowedCoords: Coordinate[],
  coord: Coordinate,
): Coordinate[] {
  const x = coord.x;
  const y = coord.x;
  const excludedCoords = [
    [-1, -1],
    [-1, 2],
    [2, -1],
    [2, 2],
  ];

  for (let dy = -1; dy < 3; dy++) {
    for (let dx = -1; dx < 3; dx++) {
      if (!excludedCoords.some(([cy, cx]) => cy === dy && cx === dx)) {
        const newY = y + dy;
        const newX = x + dx;
        const newCoord: Coordinate = { x: newX, y: newY };
        if (
          !allowedCoords.some((coord) => coord.x === newX && coord.y === newY)
        ) {
          allowedCoords.push(newCoord);
        }
      }
    }
  }
  return allowedCoords;
}

function initGame(mapSize = 9): {
  worldMap: string[][];
  cardsGoal: Card[];
  targetScore: number;
  cardsHand: Card[];
  cardsAvailable: Card[];
  allowedCoords: Coordinate[];
} {
  function InitWorldMap(mapSize: number): string[][] {
    const worldMap: string[][] = [];
    const vertBorder = ['-']
      .concat(Array.from(Array(mapSize).keys()).map((i) => String(i + 1)))
      .concat(['-']);

    worldMap.push(vertBorder);
    for (let i = 0; i < mapSize; i++) {
      worldMap.push(
        [String(i + 1)]
          .concat(Array(mapSize).fill(null))
          .concat([String(i + 1)]),
      );
    }
    worldMap.push(vertBorder);

    return worldMap;
  }

  let worldMap = InitWorldMap(mapSize);
  let cardsAvailable: Card[] = cardData.filter(
    (myCard: Card) => myCard.source === 'sprawlopolis',
  );

  let cardsGoal: Card[] = [];
  const cardsHand: Card[] = [];
  let allowedCoords: Coordinate[] = [
    { x: (mapSize + 1) / 2, y: (mapSize + 1) / 2 },
  ];
  let targetScore = 0;

  let newCardAndAvailable: { card: Card; cardsAvailable: Card[] };
  let myCard: Card;

  for (let i = 0; i < 3; i++) {
    // Draw for Goals
    newCardAndAvailable = DrawCard(cardsAvailable);
    myCard = newCardAndAvailable.card;
    cardsAvailable = newCardAndAvailable.cardsAvailable;
    cardsGoal.push(myCard);
    targetScore += parseInt(myCard.id.slice(1, 3));

    // Draw for Hand
    newCardAndAvailable = DrawCard(cardsAvailable);
    myCard = newCardAndAvailable.card;
    cardsAvailable = newCardAndAvailable.cardsAvailable;
    cardsHand.push(myCard);
  }

  newCardAndAvailable = DrawCard(cardsAvailable);
  cardsAvailable = newCardAndAvailable.cardsAvailable;
  myCard = newCardAndAvailable.card;

  const newMapAndCoords = PlayTurn(
    { x: (mapSize + 1) / 2, y: (mapSize + 1) / 2 },
    myCard,
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

function PlayTurn(
  coord: Coordinate,
  picked: Card,
  worldMap: string[][],
  cardsGoal: Card[],
  targetScore: number,
  cardsHand: Card[],
  cardsAvailable: Card[],
  allowedCoords: Coordinate[],
): {
  worldMap: string[][];
  cardsGoal: Card[];
  targetScore: number;
  cardsHand: Card[];
  cardsAvailable: Card[];
  allowedCoords: Coordinate[];
} {
  {
    if (
      allowedCoords.some(
        (allowed) => allowed.y === coord.y && allowed.x === coord.x,
      )
    ) {
      worldMap = PlayCard(worldMap, picked, coord);
      allowedCoords = CalculateAllowed(allowedCoords, coord);

      const newCardAndAvailable = DrawCard(cardsAvailable);
      cardsHand.push(newCardAndAvailable.card);
      cardsAvailable = newCardAndAvailable.cardsAvailable;

      if (cardsHand.length === 0) {
        const finalScore = EvaluateScore(worldMap, cardsGoal);

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

  function EvaluateScore(worldMap: string[][], cardsGoal: Card[]): number {
    const myClusterData = GetClustersData(worldMap);

    function ScoreBlocks(worldMap: string[][]): number {
      let score = 0;
      const myBlockTypes = ['PAR', 'RES', 'COM', 'IND'];
      myBlockTypes.forEach((cType) => {
        score += Math.max(
          ...GetClustersInfo(worldMap, myClusterData, cType, '1d_list_lengths'),
        );
      });
      return score;
    }

    function ScoreRoads(worldMap: string[][]): number {
      let score = 0;
      score -= GetClustersInfo(
        worldMap,
        myClusterData,
        'RD',
        '1d_list_lengths',
      ).length;
      return score;
    }

    function ScoreGoal(
      worldMap: string[][],
      myCardGoal: Card,
      myClusterData: ClusterData,
    ): number {
      const goalID = myCardGoal.id;
      switch (goalID) {
        case 'SO01B':
          return ScoreSO01B(worldMap, myClusterData);
        case 'SO02B':
          return ScoreSO02B(worldMap, myClusterData);
        case 'SO03B':
          return ScoreSO03B(worldMap, myClusterData);
        case 'SO04B':
          return ScoreSO04B(worldMap, myClusterData);
        case 'SO05B':
          return ScoreSO05B(worldMap, myClusterData);
        case 'SO06B':
          return ScoreSO06B(worldMap, myClusterData);
        case 'SO07B':
          return ScoreSO07B(worldMap, myClusterData);
        case 'SO08B':
          return ScoreSO08B(worldMap, myClusterData);
        case 'SO09B':
          return ScoreSO09B(worldMap, myClusterData);
        case 'SO10B':
          return ScoreSO10B(worldMap, myClusterData);
        case 'SO11B':
          return ScoreSO11B(worldMap, myClusterData);
        case 'SO12B':
          return ScoreSO12B(worldMap, myClusterData);
        case 'SO13B':
          return ScoreSO13B(worldMap, myClusterData);
        case 'SO14B':
          return ScoreSO14B(worldMap, myClusterData);
        case 'SO15B':
          return ScoreSO15B(worldMap, myClusterData);
        case 'SO16B':
          return ScoreSO16B(worldMap, myClusterData);
        case 'SO17B':
          return ScoreSO17B(worldMap, myClusterData);
        case 'SO18B':
          return ScoreSO18B(worldMap, myClusterData);
        default:
          throw new Error(`Unexpected value: ${'goal'}`);
      }
    }

    const scoreBlock = ScoreBlocks(worldMap);
    const scoreRoad = ScoreRoads(worldMap);
    const scoreGoals = cardsGoal
      .map((myCardGoal) => ScoreGoal(worldMap, myCardGoal, myClusterData))
      .reduce((partialSum, a) => partialSum + a, 0);

    return scoreBlock + scoreRoad + scoreGoals;
  }
}
