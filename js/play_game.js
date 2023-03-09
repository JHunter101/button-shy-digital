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

        let cluster_data = get_clusters_data(world_map);

        function score_blocks(world_map){
            let score = 0
            ["PAR","RES","COM","IND"].forEach(cluster_type => {
                score += max(get_clusters_info(world_map, cluster_data, cluster_type, "1d_list_lengths"));
            })
        };

        function score_roads(world_map){
            let score = 0
            score -= get_clusters_info(world_map, cluster_data, "RD", "1d_list_lengths").length();
            return score;
        };

        function score_goal(world_map, goal){
            return eval(goal + "(world_map)");

        };

        let score_block = score_blocks(world_map);
        let score_road = score_roads(world_map);

        cards_goals.map(goal => score_goal(world_map, goal));

        return [score_block] + [score_road] + cards_goals;
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