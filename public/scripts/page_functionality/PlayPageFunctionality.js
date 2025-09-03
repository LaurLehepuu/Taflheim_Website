import { getPlayer_id, getGame_id, setGame_id, sendMessage } from '../websocket_communication/WebsocketClient.js';
import { messageHandler } from '../websocket_communication/GameMessageHandler.js';
import { game_state } from '../game_scripts/managers/BoardManager.js';
import { PayLoadBuilder } from '../websocket_communication/PayLoadBuilder.js';

const create_btn = document.getElementById('create-btn');
const join_btn = document.getElementById('join-btn');
const game_id_input = document.getElementById('game-id-input');

// Create game functionality
create_btn.addEventListener('click', () => {
    console.log('Create Game button clicked');
    const payload = PayLoadBuilder.create(getPlayer_id(), game_state, 10);
    sendMessage(payload);
});

// Set up message handler for create response
messageHandler.on('create', (message) => {
    console.log(`Recieved Message ${message}`)
    setGame_id(message.game.id);
    game_id_input.value = getGame_id();
    console.log('Game created with ID:', getGame_id());
});

// Join game functionality
join_btn.addEventListener('click', () => {
    const currentGameId = game_id_input.value; // Get current input value
    
    if (!currentGameId.trim()) {
        console.error('Please enter a game ID');
        return;
    }

    const payload = PayLoadBuilder.join(getPlayer_id(), currentGameId)
    console.log(`Joining game with ID: ${currentGameId}`);
    sendMessage(payload);
});

// Set up message handler for join message
messageHandler.on('join', (message) => {
    console.log(`Recieved message: ${message}`)
    setGame_id(message.game.id);
    window.location.replace('http://localhost:3000/play/game')
});
