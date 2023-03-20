"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayTurn = exports.Rotate180 = void 0;
const score_1 = require("./score");
const cardData_1 = require("../../res/ts/cardData");
const SC_SO_1 = require("./SC_SO");
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
// RUN
const { worldMap, cardsGoal, targetScore, cardsHand, cardsAvailable, allowedCoords, } = initGame();
console.log({
    worldMap,
    cardsGoal,
    targetScore,
    cardsHand,
    cardsAvailable,
    allowedCoords,
});
function Rotate180(hand, i) {
    function Rtl(blockCode) {
        const tileCodeChunks = blockCode.split('-');
        const newCode = tileCodeChunks.map((part) => ROTATION_TRANSLATION[part] || part);
        return newCode.join('-');
    }
    const card = hand[i];
    hand[i] = {
        ...card,
        nw: Rtl(card.nw),
        ne: Rtl(card.ne),
        sw: Rtl(card.sw),
        se: Rtl(card.se),
    };
    return hand;
}
exports.Rotate180 = Rotate180;
function DrawCard(cardsAvailable) {
    const i = Math.floor(Math.random() * cardsAvailable.length);
    const card = cardsAvailable[i];
    cardsAvailable.splice(i, 1);
    return { card, cardsAvailable };
}
function PlayCard(worldMap, myCard, coord) {
    const x = coord.x;
    const y = coord.x;
    worldMap[x][y] = myCard.nw;
    worldMap[x][y + 1] = myCard.ne;
    worldMap[x + 1][y] = myCard.sw;
    worldMap[x + 1][y + 1] = myCard.se;
    return worldMap;
}
function CalculateAllowed(allowedCoords, coord) {
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
                const newCoord = { x: newX, y: newY };
                if (!allowedCoords.some((coord) => coord.x === newX && coord.y === newY)) {
                    allowedCoords.push(newCoord);
                }
            }
        }
    }
    return allowedCoords;
}
function initGame(mapSize = 9) {
    function InitWorldMap(mapSize) {
        const worldMap = [];
        const vertBorder = ['-']
            .concat(Array.from(Array(mapSize).keys()).map((i) => String(i + 1)))
            .concat(['-']);
        worldMap.push(vertBorder);
        for (let i = 0; i < mapSize; i++) {
            worldMap.push([String(i + 1)]
                .concat(Array(mapSize).fill(null))
                .concat([String(i + 1)]));
        }
        worldMap.push(vertBorder);
        return worldMap;
    }
    let worldMap = InitWorldMap(mapSize);
    let cardsAvailable = cardData_1.cardData.filter((myCard) => myCard.source === 'sprawlopolis');
    let cardsGoal = [];
    const cardsHand = [];
    let allowedCoords = [
        { x: (mapSize + 1) / 2, y: (mapSize + 1) / 2 },
    ];
    let targetScore = 0;
    let newCardAndAvailable;
    let myCard;
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
    const newMapAndCoords = PlayTurn({ x: (mapSize + 1) / 2, y: (mapSize + 1) / 2 }, myCard, worldMap, cardsGoal, targetScore, cardsHand, cardsAvailable, allowedCoords);
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
function PlayTurn(coord, picked, worldMap, cardsGoal, targetScore, cardsHand, cardsAvailable, allowedCoords) {
    {
        if (allowedCoords.some((allowed) => allowed.y === coord.y && allowed.x === coord.x)) {
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
        }
        else {
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
    function EvaluateScore(worldMap, cardsGoal) {
        const myClusterData = (0, score_1.GetClustersData)(worldMap);
        function ScoreBlocks(worldMap) {
            let score = 0;
            const myBlockTypes = ['PAR', 'RES', 'COM', 'IND'];
            myBlockTypes.forEach((cType) => {
                score += Math.max(...(0, score_1.GetClustersInfo)(worldMap, myClusterData, cType, '1d_list_lengths'));
            });
            return score;
        }
        function ScoreRoads(worldMap) {
            let score = 0;
            score -= (0, score_1.GetClustersInfo)(worldMap, myClusterData, 'RD', '1d_list_lengths').length;
            return score;
        }
        function ScoreGoal(worldMap, myCardGoal, myClusterData) {
            const goalID = myCardGoal.id;
            switch (goalID) {
                case 'SO01B':
                    return (0, SC_SO_1.ScoreSO01B)(worldMap, myClusterData);
                case 'SO02B':
                    return (0, SC_SO_1.ScoreSO02B)(worldMap, myClusterData);
                case 'SO03B':
                    return (0, SC_SO_1.ScoreSO03B)(worldMap, myClusterData);
                case 'SO04B':
                    return (0, SC_SO_1.ScoreSO04B)(worldMap, myClusterData);
                case 'SO05B':
                    return (0, SC_SO_1.ScoreSO05B)(worldMap, myClusterData);
                case 'SO06B':
                    return (0, SC_SO_1.ScoreSO06B)(worldMap, myClusterData);
                case 'SO07B':
                    return (0, SC_SO_1.ScoreSO07B)(worldMap, myClusterData);
                case 'SO08B':
                    return (0, SC_SO_1.ScoreSO08B)(worldMap, myClusterData);
                case 'SO09B':
                    return (0, SC_SO_1.ScoreSO09B)(worldMap, myClusterData);
                case 'SO10B':
                    return (0, SC_SO_1.ScoreSO10B)(worldMap, myClusterData);
                case 'SO11B':
                    return (0, SC_SO_1.ScoreSO11B)(worldMap, myClusterData);
                case 'SO12B':
                    return (0, SC_SO_1.ScoreSO12B)(worldMap, myClusterData);
                case 'SO13B':
                    return (0, SC_SO_1.ScoreSO13B)(worldMap, myClusterData);
                case 'SO14B':
                    return (0, SC_SO_1.ScoreSO14B)(worldMap, myClusterData);
                case 'SO15B':
                    return (0, SC_SO_1.ScoreSO15B)(worldMap, myClusterData);
                case 'SO16B':
                    return (0, SC_SO_1.ScoreSO16B)(worldMap, myClusterData);
                case 'SO17B':
                    return (0, SC_SO_1.ScoreSO17B)(worldMap, myClusterData);
                case 'SO18B':
                    return (0, SC_SO_1.ScoreSO18B)(worldMap, myClusterData);
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
exports.PlayTurn = PlayTurn;
