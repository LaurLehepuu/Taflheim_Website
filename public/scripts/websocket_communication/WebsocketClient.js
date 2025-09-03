 import { messageHandler } from './GameMessageHandler.js';
import { PayLoadBuilder } from './PayLoadBuilder.js';

const ws = new WebSocket('ws://localhost:8080');
let player_id = window.PLAYER_ID || localStorage.getItem("player_id") || null
let game_id = localStorage.getItem("game_id") || '';

//When connecting, check if there already was a connection
ws.addEventListener('open', () => {
    //Try to resume session
    console.log('WebSocket connection established');
        const resume_PayLoad = {
            method: 'resume',
            client_id: player_id,
            game_id,
        }
        ws.send(JSON.stringify(resume_PayLoad))
})

ws.addEventListener('close', () => console.log('WebSocket connection closed'));
ws.addEventListener('error', (error) => console.error('WebSocket error:', error));

//Pass any messages onto the messageHandler class
ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
    messageHandler.emit(message.method, message);
});

//incase resume request fails, automatically call a new_connection request
messageHandler.on('error', message => {
    if (message.error_type == "resume"){
         const new_connection_payload = {
            method: 'new_connection',
            client_id: player_id
        }
        ws.send(JSON.stringify(new_connection_payload))
    }
    return
})

//Set player_id and game_id on connect
messageHandler.on('connect', (message) => {
    if (message.game_id) {
        setGame_id(message.game_id);
    }

    //Send a ready message to the server if client has a game and client id
    if (game_id && player_id && window.location.pathname == '/play/game') {
    const payload = PayLoadBuilder.ready(player_id, game_id)
    sendMessage(payload)
    }
    return
});


//Function to send a message to the websocket server
export function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log('Sent message:', message);
    } else {
        console.error('WebSocket is not open. Unable to send message:', message);
    }
}

//if There was a played_id in the window. store it
if (player_id) {
    localStorage.setItem("player_id", player_id)
}

export const getPlayer_id = () => player_id;
export const getGame_id = () => game_id;

export const setGame_id = (id) => {
    game_id = id;
    localStorage.setItem("game_id", id)
}
