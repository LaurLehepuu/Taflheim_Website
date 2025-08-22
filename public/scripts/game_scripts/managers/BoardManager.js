import { getClient_id, getGame_id, sendMessage } from "../../websocket_communication/WebsocketClient.js";
import { messageHandler } from "../../websocket_communication/GameMessageHandler.js";
import { Hnefatafl_11x11 } from "../utils/Boards.js";
import { PayLoadBuilder } from "../../websocket_communication/PayLoadBuilder.js";


//Initialize the game state without any restricted squares
export var game_state = Hnefatafl_11x11.map(row => row.map(tile => tile === 'r' ? ' ' : tile)); 


export async function attemptToMovePiece(possible_moves, start_pos, end_pos) {
    let is_valid = await isValidMove(possible_moves, start_pos, end_pos)
    if (is_valid) {
        const [start_y, start_x] = start_pos;
        const [end_y, end_x] = end_pos;

        // Update the game state
        game_state[end_y][end_x] = game_state[start_y][start_x];
        game_state[start_y][start_x] = " ";
        // Logic to move the piece on the board
        return true;
    } 
    else {
        return false;
    }
}

function isValidMove(possible_moves, start_pos, end_pos) {
    const valid_move = possible_moves.some(([y, x]) => y === end_pos[0] && x === end_pos[1]);

    if (!valid_move) {
        console.log(`Invalid move attempted from ${start_pos} to ${end_pos}`);
        return Promise.resolve(false);
    }

    const payload = PayLoadBuilder.move(getClient_id(), getGame_id(), start_pos, end_pos)
    sendMessage(payload);

    return new Promise((resolve) => {
        messageHandler.once('move', (message) => {
            resolve(message.correct || false);
        });
    });
}

//Contains the most basic logic for moving pieces, to prevent unnecessary server requests and to display possible moves
export function getPossibleMoves(start_pos) {
    var possible_moves = [];
    var moving_piece_type = game_state[start_pos[0]][start_pos[1]];

    //Check all four directions
    checkDirection(start_pos, -1, 0, possible_moves, moving_piece_type) //Up
    checkDirection(start_pos, 1, 0, possible_moves, moving_piece_type) //Down
    checkDirection(start_pos, 0, 1, possible_moves, moving_piece_type) //Right
    checkDirection(start_pos, 0, -1, possible_moves, moving_piece_type) //Left
    
    return possible_moves;
}
//Checks if the square that is being passed in is a valid square to move to for that piece
function isValidSquare(square, moving_piece_type) {
    if (moving_piece_type != 'k') {
        return square && !square.classList.contains(`restricted-square`);
    }
    return true;
}

function isSquareBlocked(square) {
    for (const child of square.children) {
        if (child.classList.contains(`piece`)) {
            return true
        }
    }
    return false
}

function checkDirection(start_pos, dy, dx, possible_moves, moving_piece_type) {
    let [start_y, start_x] = start_pos
    let y = start_y + dy;
    let x = start_x + dx;

    //Handle Bounds checking based on direction
    while (true) {
      if (dy < 0 && y < 0) break; //Moving Up
      if (dy > 0 && y >= game_state.length) break; //Moving Down
      if (dx < 0 && x < 0) break; //Moving Left
      if (dx > 0 && x >= game_state.length) break; //Moving right
      
      const square = document.querySelector(`.square[data-y="${y}"][data-x="${x}"]`)
      if (isValidSquare(square, moving_piece_type)) {
        if (isSquareBlocked(square)) {
            break
        }

        possible_moves.push([y, x]);
        y += dy;
        x += dx;
      } else {
        break;
      }
    }
}

//Update game_state on sync message (need to add actual update too)
messageHandler.on('sync', (message) => {
    const [to_y, to_x] = message.move_to
    const [from_y, from_x] = message.move_from

    //update local game state
    game_state[to_y][to_x] = game_state[from_y][from_x]
    game_state[from_y][from_x] = ' '

    //Visually move the pieces
    const from_square = document.querySelector(`.square[data-y="${from_y}"][data-x="${from_x}"]`)
    const to_square = document.querySelector(`.square[data-y="${to_y}"][data-x="${to_x}"]`)
    const piece = from_square.querySelector(`.piece`)
    to_square.appendChild(piece)
});


//Remove pieces that have been taken from the board
messageHandler.on('taken', (message) => {
    message.taken_piece_coordinates.forEach(coordinate => {
        const [x, y] = coordinate
        const square = document.querySelector(`.square[data-y="${y}"][data-x="${x}"]`)

        if (!square) {
            null
        }
        
        square.querySelector('.piece').remove()
    })
});

//Display possible moves on the board
export function toggleShowPossibleMoves(possible_moves, show = true) {
    var already_shown_moves = document.querySelectorAll('.possible-move-indicator');

    // Remove existing indicators if any exist
    if (already_shown_moves.length > 0) {
        already_shown_moves.forEach(indicator => {
            indicator.remove();
        });
    }
    //If its meant to toggle off, stop here
    if (!show) {
        return;
    }
    // Else add indicators for each possible move
    possible_moves.forEach(([y, x]) => {
        const square = document.querySelector(`.square[data-y="${y}"][data-x="${x}"]`);
        if (square) {
            const possible_move_indicator = document.createElement('div');
            possible_move_indicator.classList.add('possible-move-indicator');
            square.appendChild(possible_move_indicator)
        }
    });
}
