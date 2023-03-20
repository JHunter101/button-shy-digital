"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardData = void 0;
/* eslint-disable semi */
/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
/* eslint-disable comma-spacing */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
exports.cardData = [{ "id": "SO01_A", "source": "sprawlopolis", "nw": "IND-RDE-RDW", "ne": "COM-RDS-RDW", "sw": "PAR", "se": "RES-RDN-RDS", "goal_info": "1 * road that does not end at the edge of the city.\n-1 * road that ends at the edge of the city." }, { "id": "SO02_A", "source": "sprawlopolis", "nw": "RES-RDN-RDS", "ne": "COM-RDN-RDE", "sw": "IND-RDN-RDS", "se": "PAR", "goal_info": "1 * each row & collumn with exactly 3 park blocks in it.\n-3 * 1 * each row & collumn with exactly 0 park blocks in it." }, { "id": "SO03_A", "source": "sprawlopolis", "nw": "IND-RDS-RDE", "ne": "RES-RDE-RDW", "sw": "COM-RDN-RDS", "se": "PAR", "goal_info": "1 * park blocks in your city.\n-3* industrial blocks in your city." }, { "id": "SO04_A", "source": "sprawlopolis", "nw": "IND-RDN-RDS", "ne": "PAR", "sw": "RES-RDN-RDE", "se": "COM-RDE-RDW", "goal_info": "-8 + 3 * groups of 4 \"corner to corner\" blocks of the same type. You may score multiple groups of the same type and a block may apply to more than one group. (max 7)" }, { "id": "SO05_A", "source": "sprawlopolis", "nw": "COM-RDE-RDW", "ne": "IND-RDE-RDW", "sw": "RES-RDS-RDE", "se": "PAR", "goal_info": "2 * industrial blocks adjecent to only commercial or industrial blocks" }, { "id": "SO06_A", "source": "sprawlopolis", "nw": "RES-RDE-RDW", "ne": "IND-RDS-RDW", "sw": "PAR", "se": "COM-RDN-RDS", "goal_info": "Subtract the number of blocks in your largest industrial group from the number of blocks in your largest residential group. score that many points" }, { "id": "SO07_A", "source": "sprawlopolis", "nw": "RES-RDE-RDW", "ne": "COM-RDE-RDW", "sw": "IND-RDS-RDW", "se": "PAR", "goal_info": "1 * parks located on the interior of the city\n-2 * parks located on the edge of the city" }, { "id": "SO08_A", "source": "sprawlopolis", "nw": "PAR", "ne": "IND-RDN-RDS", "sw": "COM-RDE-RDW", "se": "RES-RDN-RDW", "goal_info": "1 * park blocks adjecent to your largest group of residential blocks.\n-2 * industrial blocks adjecent to your largest group of residential blocks" }, { "id": "SO09_A", "source": "sprawlopolis", "nw": "PAR", "ne": "RES-RDN-RDS", "sw": "IND-RDS-RDW", "se": "COM-RDN-RDW", "goal_info": "1* industrial block that shares a corner with atleast 1 other industrial block" }, { "id": "SO10_A", "source": "sprawlopolis", "nw": "RES-RDN-RDW", "ne": "PAR", "sw": "COM-RDE-RDW", "se": "IND-RDE-RDW", "goal_info": "1 * commercial block in any 1 row or collumn of your choice. you may only score 1 row or collumn" }, { "id": "SO11_A", "source": "sprawlopolis", "nw": "COM-RDS-RDE", "ne": "IND-RDS-RDE", "sw": "RES-RDN-RDS", "se": "PAR", "goal_info": "2 * commercial block directly between two residential blocks with the same road connecting all three blocks. Blocks may be a straight line or in a stepped pattern" }, { "id": "SO12_A", "source": "sprawlopolis", "nw": "RES-RDN-RDS", "ne": "PAR", "sw": "COM-RDN-RDS", "se": "IND-RDS-RDE", "goal_info": "1 * every two road sections (rounded down) that are part of your longest road" }, { "id": "SO13_A", "source": "sprawlopolis", "nw": "IND-RDN-RDS", "ne": "RES-NE", "sw": "COM-RDN-RDS", "se": "PAR", "goal_info": "3 * road that begins at one park and ends at a different park" }, { "id": "SO14_A", "source": "sprawlopolis", "nw": "COM-RDN-RDW", "ne": "RES-RDN-RDS", "sw": "PAR", "se": "IND-RDN-RDS", "goal_info": "1 * road section in a completed loop. You may score multiple loops in your city" }, { "id": "SO15_A", "source": "sprawlopolis", "nw": "IND-RDN-RDW", "ne": "PAR", "sw": "RES-RDE-RDW", "se": "COM-RDE-RDW", "goal_info": "2 * residential blocks adjecent to 2 or more industrial blocks" }, { "id": "SO16_A", "source": "sprawlopolis", "nw": "IND-RDE-RDW", "ne": "RES-RDE-RDW", "sw": "COM-RDS-RDW", "se": "PAR", "goal_info": "2* roads that passes through both a Residential block and a commercial block" }, { "id": "SO17_A", "source": "sprawlopolis", "nw": "COM-RDN-RDW", "ne": "PAR", "sw": "IND-RDE-RDW", "se": "RES-RDE-RDW", "goal_info": "1 * commercial block on the edge of the city.\n1 * commercial block on a corner edge." }, { "id": "SO18_A", "source": "sprawlopolis", "nw": "COM-RDN-RDS", "ne": "PAR", "sw": "IND-RDN-RDS", "se": "RES-RDS-RDE", "goal_info": "add the number of blocks in your longest row to the number of blocks in your longest column (skipping any gaps). score that many points" }, { "id": "AO01_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO02_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO03_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO04_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO05_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO06_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO07_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO08_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO09_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO10_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO11_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO12_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO13_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO14_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO15_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO16_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO17_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "AO18_A", "source": "agropolis ", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO01_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO02_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO03_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO04_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO05_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO06_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO07_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO08_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO09_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO10_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO11_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO12_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO13_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO14_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO15_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO16_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO17_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }, { "id": "NO18_A", "source": "naturopolis", "nw": "", "ne": "", "sw": "", "se": "", "goal_info": "" }];
