import { messageHandler } from "../../websocket_communication/GameMessageHandler.js";
import { getClient_id } from "../../websocket_communication/WebsocketClient.js";
import { Timer } from "../utils/Timer.js";
//Html Elements
    //Game over
    const gameOverCard = document.getElementById('game-over-reason-card');
    const winnerText = document.getElementById('winner-text');
    const win_reason = document.getElementById('win-reason-text');
    //Cards
    const opponent_card = document.querySelector(".opponent-card");
    const player_card = document.querySelector(".player-card")
    //Timers
    const player_timer = player_card.querySelector(".card-timer > .timer")
    const opponent_timer = opponent_card.querySelector(".card-timer > .timer")

//Other variables
export const timer = new Timer();
let role;
const client_id = getClient_id()

messageHandler.on("move", (message) => {
    changeTurn();
    showPreviousMove(message.move_from, message.move_to);
});


messageHandler.on("start", (message) => {
    if (message.attacker == client_id) {
        role = 'attacker'
        player_card.classList.add('turn-active')
    } else { 
        role = 'defender'
        opponent_card.classList.add('turn-active')
    }

    //Start timer
    timer.initialize(message.timers)
    timer.start()
    
    //Update time every second
    setInterval(() => {
        const times = timer.getFormattedTimes();
        updateUITimers(times);
    }, 1000);
})

//When win occurs, show win reason
messageHandler.on("win", (message) => {
    const winner = capitalize(message.winner)
    winnerText.textContent = `${winner}s Win!`
    timer.stop()
    updateUITimers(timer.getFormattedTimes())
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
    case 'defender_timeout':
        win_reason.textContent = "The defenders ran out of time"
        break;
    case 'attacker_timeout':
        win_reason.textContent = "The attackers ran out of time"
        break;
    }
    
    gameOverCard.style.display = 'flex'
});
                
                
function changeTurn() {
    if (player_card.classList.contains('turn-active')) {
        player_card.classList.remove('turn-active')
        opponent_card.classList.add('turn-active')
    } else {
        opponent_card.classList.remove('turn-active')
        player_card.classList.add('turn-active')
    }
}        

function updateUITimers(times) {
    if (role == 'attacker'){
        opponent_timer.textContent = times.defender
        player_timer.textContent = times.attacker
    } else {
        opponent_timer.textContent = times.attacker
        player_timer.textContent = times.defender
    }
}

function showPreviousMove(move_from, move_to) {
    const [from_y, from_x] = move_from
    const [to_y, to_x] = move_to

    const shown_moves = document.querySelectorAll('.previous-move');
    console.log(shown_moves)
    if (shown_moves) {
        shown_moves.forEach(element => {
            element.classList.remove('previous-move')    
        });
    }

    //Find squares and add class to them
    const from_square = document.querySelector(`.square[data-y='${from_y}'][data-x='${from_x}']`)
    const to_square = document.querySelector(`.square[data-y='${to_y}'][data-x='${to_x}']`)
    from_square.classList.add('previous-move')
    to_square.classList.add('previous-move')
}

function capitalize(s)
{
    return String(s[0]).toUpperCase() + String(s).slice(1);
}
