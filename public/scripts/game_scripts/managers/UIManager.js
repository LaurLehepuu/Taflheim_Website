import { messageHandler } from "../../websocket_communication/GameMessageHandler.js";

const gameOverCard = document.getElementById('game-over-reason-card');
const winnerText = document.getElementById('winner-text')
const win_reason = document.getElementById('win-reason-text')

messageHandler.on("win", (message) => {
    winnerText.textContent = `${message.winner}s Win!`

    switch (message.win_reason){
        case 'king_corner_retreat':
            win_reason.textContent = 'The king has escaped to a corner!';
            break;
        case 'edge_fort_escape':
            win_reason.textContent = "The king is secure in an edge fort!";
            break;
        case 'king_surrounded':
            win_reason.textContent = "The king has been surrounded!";
            break;
        case 'defenders_surrounded':
            win_reason.textContent = "The defenders have been surrounded!";
            break;
    }

    gameOverCard.style.display = 'flex'
});
