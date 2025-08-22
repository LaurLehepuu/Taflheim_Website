/* Game entry point*/
import {generate_board} from "./utils/BoardGenerator.js";
import {game_state} from "./managers/BoardManager.js";
import {Hnefatafl_11x11} from "./utils/Boards.js";
import './managers/UIManager.js';
import './managers/GameManager.js';
import '../page_functionality/GamePageFunctionality.js';

// Initialize the game board once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    generate_board(Hnefatafl_11x11);
    console.log('Game state initialized:', game_state);
});
