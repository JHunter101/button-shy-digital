// Helpers
function get_columns(world_map) {
    return world_map[0].map((_, col) =>
            world_map.reduce((columnValues, rowValues, row) =>
                rowValues[col] !== null ? columnValues.concat([
                    [row, col]
                ]) : columnValues,
                [])
        )
        .filter(columnValues => columnValues.length > 0);
}


function get_rows(world_map) {
    return world_map.map((rowValues, row) =>
            rowValues.reduce((rowCoords, cellValue, col) =>
                cellValue !== null ? rowCoords.concat([
                    [row, col]
                ]) : rowCoords,
                [])
        )
        .filter(rowCoords => rowCoords.length > 0);
}


function get_road_exits(block) {
    return [];
}

function is_neighbor(world_map, x, y, direction, target) {
    switch (direction) {

        // Self
        case "self":
            return world_map[y][x].includes(target) ? [
                [y, x]
            ] : [];

            // Multi
        case "all_adj":
            return is_neighbor(world_map, x, y, "N", target) + is_neighbor(world_map, x, y, "E", target) + is_neighbor(world_map, x, y, "S", target) + is_neighbor(world_map, x, y, "W", target);

        case "all_cross":
            return is_neighbor(world_map, x, y, "NW", target) + is_neighbor(world_map, x, y, "NE", target) + is_neighbor(world_map, x, y, "SW", target) + is_neighbor(world_map, x, y, "SE", target);

        case "all_2x2":
            return is_neighbor(world_map, x, y, "self", target) + is_neighbor(world_map, x, y, "E", target) + is_neighbor(world_map, x, y, "S", target) + is_neighbor(world_map, x, y, "SE", target);

            // Single Direct
        case "N":
            return world_map[y - 1][x].includes(target) ? [
                [y - 1, x]
            ] : [];
        case "E":
            return world_map[y][x + 1].includes(target) ? [
                [y, x + 1]
            ] : [];
        case "S":
            return world_map[y + 1][x].includes(target) ? [
                [y + 1, x]
            ] : [];
        case "W":
            return world_map[y][x - 1].includes(target) ? [
                [y, x - 1]
            ] : [];

            // Single Corner
        case "NW":
            return world_map[y - 1][x - 1].includes(target) ? [
                [y - 1, x - 1]
            ] : [];
        case "NE":
            return world_map[y - 1][x + 1].includes(target) ? [
                [y - 1, x + 1]
            ] : [];
        case "SW":
            return world_map[y + 1][x - 1].includes(target) ? [
                [y + 1, x - 1]
            ] : [];
        case "SE":
            return world_map[y + 1][x + 1].includes(target) ? [
                [y + 1, x + 1]
            ] : [];

            // Default
        default:
            return [];
    }
}

function smart_road_is_neighbor(world_map, x, y, target, road_type = "RD", road_to_road = false) {
    let output = [];
    if (world_map[y][x].includes("-" + road_type + "N-")) {
        if (road_to_road) {
            target = "-" + road_type + "s-";
        }
        output += is_neighbor(world_map, x, y, "N", target)
    }
    if (world_map[y][x].includes("-" + road_type + "E-")) {
        if (road_to_road) {
            target = "-" + road_type + "s-";
        }
        output += is_neighbor(world_map, x, y, "E", target)
    }
    if (world_map[y][x].includes("-" + road_type + "S-")) {
        if (road_to_road) {
            target = "-" + road_type + "s-";
        }
        output += is_neighbor(world_map, x, y, "S", target)
    }
    if (world_map[y][x].includes("-" + road_type + "W-")) {
        if (road_to_road) {
            target = "-" + road_type + "s-";
        }
        output += is_neighbor(world_map, x, y, "W", target)
    }
    return output;
}

function get_clusters_data(world_map) {
    let cluster_data = {}
    let visited = []
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (visited.includes([y, x]) || world_map[y][x] == null) {
                continue;
            }
            let cluster = []
            let to_visit = [
                [y, x]
            ]
            const cluster_type = world_map[y][x].slice(0, 3);
            if (!(cluster_type in cluster_data)) {
                cluster_data[cluster_type] = [];
            }

            while (to_visit.length > 0) {
                let current = to_visit.pop();
                if (visited.includes(current)) {
                    continue;
                }
                visited.push(current);

                if (world_map[current[0]][current[1]].includes(cluster_type)) {
                    cluster.push(current);
                    to_visit.push([current[0] - 1, current[1]]);
                    to_visit.push([current[0], current[1] + 1]);
                    to_visit.push([current[0] + 1, current[1]]);
                    to_visit.push([current[0], current[1] - 1]);
                }
            }

            cluster_data[cluster_type].push(cluster);
        }
    }


    ["RD", "RV"].forEach(cluster_type => {
        cluster_data[cluster_type] = [];
        let visited = []
        for (let y = 1; y < world_map.length - 1; y++) {
            for (let x = 1; x < world_map.length - 1; x++) {
                if (visited.includes([y, x]) || world_map[y][x] == null) {
                    continue;
                }

                let cluster = []
                let to_visit = [
                    [y, x]
                ]

                while (to_visit.length > 0) {
                    let current = to_visit.pop();
                    if (visited.includes(current)) {
                        continue;
                    }
                    visited.push(current);
                    const neighbors = smart_road_is_neighbor(world_map, current[0], current[1], null, "RD", true);
                    cluster += neighbors;
                    to_visit += neighbors;
                }

                cluster_data[cluster_type].push(cluster);
            }
        }

    });

    cluster_data["ROW"] = get_row(world_map);
    cluster_data["COL"] = get_columns(world_map);

    return cluster_data;
}

function get_clusters_info(world_map, cluster_data, cType, info_type) {

    switch (info_type) {
        case "2d_list_coordinates": {
            return cluster_data[cType]
        }
        case "2d_list_values": {
            get_clusters_info(world_map, cType, '2d_list_coordinates')
                .map(sublist => sublist.map(coord => world_map[coord[0]][coord[1]]));
        }
        case "1d_list_lengths": {
            return get_clusters_info(world_map, cType, '2d_list_coordinates')
                .map(list => list.length);
        }
        case "2d_list_longest": {
            const _2d_list_coordinates = get_clusters_info(world_map, cType, '2d_list_coordinates');
            const maxLength = _2d_list_coordinates.reduce((acc, curr) => Math.max(acc, curr.length), 0);
            return _2d_list_coordinates.filter(sublist => sublist.length === maxLength);
        }
    }

}

function score_SO01_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (smart_road_is_neighbor(world_map, x, y, null, "RD", false)
                .length > 0) {
                score -= 1;
            } else {
                score += 1;
            }
        }
    }
    return score
}

function score_SO02_B(world_map) {
    let score = 0;
    const to_check = get_clusters_info(world_map, cluster_data, "COL", "2d_list_values") + get_clusters_info(world_map, cluster_data, "ROW", "2d_list_values");
    to_check.forEach(cluster => {
        if (cluster.filter(value => value.includes("-PAR"))
            .length == 3) {
            score += 1;
        } else if (cluster.filter(value => value.includes("-PAR"))
            .length == 0) {
            score -= 3;
        }
    });
    return score;
}

function score_SO03_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            score += (is_neighbor(world_map, x, y, "self", "PAR-")
                .length == 1) ? 1 : (is_neighbor(world_map, x, y, "self", "IND-")
                .length == 1) ? -3 : 0;
        }
    }
    return score
}


function score_SO04_B(world_map) {
    let score = -8;

    for (let y = 1; y < world_map.length - 1; y++) {
        if (score == 7) {
            break
        }
        for (let x = 1; x < world_map.length - 1; x++) {
            if (score == 7) {
                break
            }

            if (is_neighbor(world_map, x, y, "all_2x2", world_map[y][x].slice(0, 3))
                .length == 4) {
                score += 3;
            }
        }
    }
    return score;
}

function score_SO05_B(world_map) {
    let score = 0;

    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "IND-")
                .length == 1) {

                if (is_neighbor(world_map, x, y, "all_adj", "IND-")
                    .length + (is_neighbor(world_map, x, y, "all_adj", "COM-")
                        .length == 4)) {
                    score += 2;
                }
            }
        }
    }

    return score;
}

function score_SO06_B(world_map) {
    let score = 0;
    score += Math.max(get_clusters_info(world_map, cluster_data, 'RES', '1d_list_lengths'));
    score -= Math.max(get_clusters_info(world_map, cluster_data, 'IND', '1d_list_lengths'));
    return score;
}

function score_SO07_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "PAR-")
                .length == 1) {
                if (is_neighbor(world_map, x, y, "all_adj", null)
                    .length == 0) {
                    score += 1
                } else {
                    score -= 2
                }
            }
        }
    }

    return score;
}

function score_SO08_B(world_map) {
    let scores = [];
    const _2d_list_longest = get_clusters_info(world_map, cluster_data, 'RES', '2d_list_longest')

    _2d_list_longest.forEach(cluster => {
        let score = 0;
        let parks = {};
        let inds = {};
        cluster.forEach(([y, x]) => {

            is_neighbor(world_map, x, y, "self", "PAR-")
                .forEach(coord => {
                    if (parks[coord]) {} else {
                        parks[coord] = 1;
                        score += 1;
                    }
                })

            is_neighbor(world_map, x, y, "self", "IND-")
                .forEach(coord => {
                    if (inds[coord]) {} else {
                        inds[coord] = 1;
                        score -= 3;
                    }
                })
        });
        scores.push(score);
    });

    return score;
}

function score_SO09_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "IND-")
                .length == 1) {
                if (is_neighbor(world_map, x, y, "all_cross", "IND-")
                    .length > 0) {
                    score += 1
                }
            }
        }
    }

    return score;
}

function score_SO10_B(world_map) {
    let score = 0;
    const to_check = get_clusters_info(world_map, cluster_data, "COL", "2d_list_values") + get_clusters_info(world_map, cluster_data, "ROW", "2d_list_values");
    score = max(to_check.map(cluster => {
        cluster.filter(value => value.includes("-COM"))
            .length()
    }))
    return score;
}

function score_SO11_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "COM-")
                .length == 1) {
                if (smart_road_is_neighbor(world_map, x, y, null, "RD", true)
                    .filter(coord => is_neighbor(world_map, coord[0], coord[1], "self", "RES-")
                        .length == 1)
                    .length > 2) {
                    score += 2;
                }
            }
        }
    }
    return score;
}

function score_SO12_B(world_map) {
    let score = 0;
    score = max(get_clusters_info(world_map, cluster_data, "RD", "1d_list_lengths")) / 2;
    return score;
}

function score_SO13_B(world_map) {
    let score = 0;
    get_clusters_info(world_map, cluster_data, "RD", "2d_list_coords")
        .forEach(cluster => {
            if (cluster.filter(coord => smart_road_is_neighbor(world_map, coord[0], coord[1], null, "RD", true)
                    .length == 1)
                .filter(coord => is_neighbor(world_map, coord[0], coord[1], "self", "PAR-")
                    .length == 1)
                .length == 2) {
                score += 3;
            }

        })
    return score;
}

function score_SO14_B(world_map) {
    let score = 0;
    score = get_clusters_info(world_map, cluster_data, "RD", "2d_list_coords")
        .filter(cluster => cluster.filter(coord => smart_road_is_neighbor(world_map, coord[0], coord[1], null, "RD", true)
                .length < 2)
            .length > 0)
        .map(cluster => cluster.length)
        .reduce((partialSum, a) => partialSum + a, 0);
    return score;
}

function score_SO15_B(world_map) {
    let score = 0;
    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "RES-")
                .length == 1) {
                if (is_neighbor(world_map, x, y, "all_adj", "IND-")
                    .length >= 2) {
                    score += 2;
                }
            }
        }
    }
    return score;
}

function score_SO16_B(world_map) {
    let score = 0;

    score = get_clusters_info(world_map, cluster_data, "RD", "2d_list_coords")
        .filter(cluster => cluster.filter(coord => is_neighbor(world_map, coord[0], coord[1], "RES")
            .length > 0 && cluster.filter(coord => is_neighbor(world_map, coord[0], coord[1], "COM")
                .length > 0))) * 2

    return score;
}

function score_SO17_B(world_map) {
    let score = 0;

    for (let y = 1; y < world_map.length - 1; y++) {
        for (let x = 1; x < world_map.length - 1; x++) {
            if (is_neighbor(world_map, x, y, "self", "COM-")
                .length == 1) {
                if (is_neighbor(world_map, x, y, "all_adj", null)
                    .length > 0) {
                    score += 1;
                    if (is_neighbor(world_map, x, y, "all_cross", null)
                        .length > 0) {
                        score += 1;
                    }
                }
            }
        }
    }

    return score;
}

function score_SO18_B(world_map) {
    let score = 0;
    score += max(get_clusters_info(world_map, cluster_data, "COL", "1d_list_lengths"));
    score += max(get_clusters_info(world_map, cluster_data, "ROW", "1d_list_lengths"));
    return score;
}