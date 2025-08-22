 import { messageHandler } from './GameMessageHandler.js';
import { PayLoadBuilder } from './PayLoadBuilder.js';

const ws = new WebSocket('ws://localhost:8080');
let client_id = localStorage.getItem("client_id") || '';
let game_id = localStorage.getItem("game_id") || '';

//When connecting, check if there already was a connection
ws.addEventListener('open', () => {
    console.log('WebSocket connection established');
    if (client_id) {
        const resume_PayLoad = {
            method: 'resume',
            client_id,
            game_id,
        }

        ws.send(JSON.stringify(resume_PayLoad))
    } else {
        ws.send(JSON.stringify({method: 'new_connection'}))
    }
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
    if (message.type == "resume"){
        ws.send(JSON.stringify({method:"new_connection"}))
    }
    return
})

//Set client_id and game_id on connect
messageHandler.on('connect', (message) => {
    setClient_id(message.client_id);
    if (message.game_id) {
        setGame_id(message.game_id);
    }

    //Send a ready message to the server if client has a game and client id
    if (game_id && client_id) {
    const payload = PayLoadBuilder.ready(client_id, game_id)
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

export const getClient_id = () => client_id;
export const getGame_id = () => game_id

export const setClient_id = (id) => {
     client_id = id;
     localStorage.setItem("client_id", id)
}

export const setGame_id = (id) => {
    game_id = id;
    localStorage.setItem("game_id", id)
}
