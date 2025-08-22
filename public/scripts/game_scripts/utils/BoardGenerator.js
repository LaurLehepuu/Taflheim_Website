import {mouseEnter, mouseDown, onClick} from "../managers/PieceDraggingManager.js"

const game_board_container = document.getElementById('game-board');
export async function generate_board(game_board) {
    for (let row = 0; row < game_board.length; row++) {
        let row_div = document.createElement('div');
        row_div.className = `row${game_board[row].length - row}, game-row`;

        for (let col = 0; col < game_board[row].length; col++) {
            let square = document.createElement('div');
            let tile = game_board[row][col][0];
            square.className = 'square';
            square.dataset.y = row;
            square.dataset.x = col;
            square.addEventListener('mouseenter', mouseEnter)
            square.addEventListener('click', onClick);

            if (tile === 'a') {
                square.classList.add('attacker-square');
                let attacker = create_piece('a');
                square.appendChild(attacker);
                
            } else if (tile === 'd') {
                square.classList.add('defender-square');
                let defender = create_piece('d');
                square.appendChild(defender);
                
            } else if (tile === 'k') {
                square.classList.add('king-square');
                let king = create_piece('k');
                square.appendChild(king);
                
            } else if (tile === 'r') {
                    square.classList.add('restricted-square');

            } else {
                square.classList.add('blank-square');
            }
        
            row_div.appendChild(square);
        game_board_container.appendChild(row_div);
        }
    }
}
function create_piece(piece_type) {
    let piece = document.createElement('div');
    piece.className = 'piece';
    
    if (piece_type === 'a') {
        piece.classList.add('attacker');
        piece.dataset.type = 'attacker';
        return piece;
        
    } else if (piece_type === 'd') {
        piece.classList.add('defender');
        piece.dataset.type = 'defender';
        return piece;
        
    } else if (piece_type === 'k') {
        piece.classList.add('defender');
        piece.classList.add('king');
        piece.dataset.type = 'king';
        return piece;
        
    } else {
        piece.remove();
        console.error('Invalid piece type');
    }
}
