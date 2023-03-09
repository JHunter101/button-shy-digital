// dictionaries
var rotation_translation = {
    "RDN": "RDS",
    "RDE": "RDW",
    "RDS": "RDN",
    "RDW": "RDE",
    "RVN": "RDS",
    "RVE": "RDW",
    "RVS": "RDN",
    "RVW": "RDE",
    "CPN": "RDS",
    "CPE": "RDW",
    "CPS": "RDN",
    "CPW": "RDE"
}

// general functions
function rotate_180(arr) {
    function rtl(tile_code) {
        let tile_code_chunks = tile_code.split("-");
        let new_code = tile_code_chunks.map(part => rotation_translation[part] || part);
        return new_code.join("-");
    }
    return [
        [rtl(arr[1][1]), rtl(arr[1][0])],
        [rtl(arr[0][1]), rtl(arr[0][0])]
    ];
}

function flip_card(cid) {
    if (cid.slice(-1) === "A") {
        cid = cid.slice(0, -1) + "B";
    } else if (cid.slice(-1) === "B") {
        cid = cid.slice(0, -1) + "A";
    }
    return cid;
}

function play(map_size = 9, rounds = 15) {

    // Play functions
    function draw_card(cards_available) {
        let i = Math.floor(Math.random() * cards_available.length);
        let card = cards_available[i];
        cards_available.splice(i, 1);
        return card;
    }

    // SETUP GAME
    function setup() {
        function init_world_map(map_size = 9) {
            const world_map = [];
            world_map.push([
                ['-'].concat([...Array(map_size).keys()].map(i => i + 1))
            ].concat(['-']));
            for (let i = 0; i < map_size; i++) {
                world_map.push([i + 1].concat(Array(map_size).fill(null)).concat([i + 1]));
            }
            world_map.push([
                ['-'].concat([...Array(map_size).keys()].map(i => i + 1))
            ].concat(['-']));

            return world_map;
        }

        // Setup Map
        var world_map = init_world_map(map_size);


        // Init Deck Piles
        var cards_available = [];
        var cards_goal = [];
        var cards_hand = [];
        let target_score = 0;

        // Draw Goal Cards
        for (let i = 0; i < 3; i++) {
            var card = flip_card(draw_card(cards_available));
            cards_goal.push(card);
            target_score += parseInt(str.slice(1, 3));
        }

        // Draw Hand Cards
        for (let i = 0; i < 3; i++) {
            var card = draw_card(cards_available);
            cards_hand.push(card);
        }
    }

    // Main Game Loop
    function place_card(card, x, y, allowed_coords) {
        if (allowed_coords.some(coord => coord[0] === x && coord[1] === y)) {
            world_map[x][y] = card[0][0];
            world_map[x][y + 1] = card[0][1];
            world_map[x + 1][y] = card[1][0];
            world_map[x + 1][y + 1] = card[1][1];
            calculate_allowed(allowed_coords, x, y);
        }
    }

    function calculate_allowed(allowed_coords, x, y) {
        for (let dy = -1; dy < 3; dy++) {
            for (let dx = -1; dx < 3; dx++) {
                if (![
                        [-1, -1],
                        [-1, 2],
                        [2, -1],
                        [2, 2]
                    ].some(([cy, cx]) => cy === dy && cx === dx)) {
                    allowed_coords.add('${y+dy},${x+dx}');
                }
            }
        }
    }

    // Evaluate Score    
    function evaluate_score(world_map) {

        // Score blocks
        function score_blocks(world_map) {
            function find_biggest_clusters(world_map) {
                function dfs(i, j, baseid) {
                    if (i < 0 || i >= n || j < 0 || j >= m || !world_map[i][j].includes(baseid)) {
                        return 0;
                    }
                    let size = 1;
                    world_map[i][j] = -1;
                    size += dfs(i - 1, j, baseid);
                    size += dfs(i + 1, j, baseid);
                    size += dfs(i, j - 1, baseid);
                    size += dfs(i, j + 1, baseid);
                    return size;
                }

                const n = world_map.length;
                const m = world_map[0].length;
                const clusters = {};
                const baseids = ["PAR", "RES", "IND", "COM"];
                for (let k = 0; k < baseids.length; k++) {
                    const baseid = baseids[k];
                    const sizes = [];
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < m; j++) {
                            if (world_map[i][j].includes(baseid)) {
                                sizes.push(dfs(i, j, baseid));
                            }
                        }
                    }
                    if (sizes.length > 0) {
                        clusters[baseid] = Math.max(...sizes);
                    }
                }
                return clusters;
            }

            let clusters = find_biggest_clusters(world_map);
            let sortedClusters = Object.values(clusters).sort();
            let bestClusters = sortedClusters.slice(0, 4);
            let score = 0;
            for (let i = 0; i < bestClusters.length; i++) {
                score += bestClusters[i];
            }
            return score;
        }

        function score_roads(world_map) {
            const visited = new Set(); // to keep track of visited cells
            let count = 0; // to keep track of the number of clusters

            // helper function to recursively explore neighboring cells
            function explore(x, y) {
                visited.add(`${x},${y}`);

                // check north neighbor
                if (y > 0 && !visited.has(`${x},${y-1}`) && (world_map[y][x].includes('-RDS-') || world_map[y - 1][x].includes('-RDN-'))) {
                    explore(x, y - 1);
                }

                // check south neighbor
                if (y < world_map.length - 1 && !visited.has(`${x},${y+1}`) && (world_map[y][x].includes('-RDN-') || world_map[y + 1][x].includes('-RDS-'))) {
                    explore(x, y + 1);
                }

                // check west neighbor
                if (x > 0 && !visited.has(`${x-1},${y}`) && (world_map[y][x].includes('-RDW-') || world_map[y][x - 1].includes('-RDE-'))) {
                    explore(x - 1, y);
                }

                // check east neighbor
                if (x < world_map[0].length - 1 && !visited.has(`${x+1},${y}`) && (world_map[y][x].includes('-RDE-') || world_map[y][x + 1].includes('-RDW-'))) {
                    explore(x + 1, y);
                }
            }

            // iterate through each cell in the world_map
            for (let y = 0; y < world_map.length; y++) {
                for (let x = 0; x < world_map[0].length; x++) {
                    if (!visited.has(`${x},${y}`) && world_map[y][x].includes('-RD')) {
                        explore(x, y);
                        count++;
                    }
                }
            }

            return count;
        }


        // Score roads
        function score_roads_old(world_map) {
            let score = 0;
            const map_size = world_map.length;
            for (let y = 1; y < map_size; y++) {
                for (let x = 1; x < map_size; x++) {
                    if (world_map[y][x].includes("-RDN-")) {
                        if (!world_map[y - 1][x].includes("-RDS")) {
                            score -= 1;
                        }
                    }
                    if (world_map[y][x].includes("-RDE-")) {
                        if (!world_map[y][x + 1].includes("-RDW")) {
                            score -= 1;
                        }
                    }
                    if (world_map[y][x].includes("-RDS-")) {
                        if (!world_map[y + 1][x].includes("-RDN")) {
                            score -= 1;
                        }
                    }
                    if (world_map[y][x].includes("-RDW-")) {
                        if (!world_map[y][x - 1].includes("-RDE")) {
                            score -= 1;
                        }
                    }
                }
            }
            return score / 2;
        }

        // Score goal cards
        function score_goals(cards3, world_map) {
            const score_lib = {};
            let score = 0;
            for (const card of cards_goal) {
                score += eval(score_lib[card]);
            }
            return score;
        }

        score_block = score_blocks(world_map);
        score_road = score_roads(world_map);
        score_goals = score_goals(cards_goal, world_map);

        return score_block + score_road + score_goals;
    }

    setup();
    place_card(draw_card(), (mapsize - 1) / 2, (mapsize - 1) / 2, cards_allowed);

    while (rounds > 0) {
        // pick a x y
        x = 1;
        y = 1;
        play_card(world_map, x, y);
        rounds -= 1;
    }

    final_score = evaluate_score();

    return final_score;
}

play(9, 15);