/* Starts the game and stops it when needed
preventing people from playing until its started */

import { messageHandler } from "../../websocket_communication/GameMessageHandler.js";
import { getClient_id } from "../../websocket_communication/WebsocketClient.js";
import { onClick, mouseDown } from "./PieceDraggingManager.js";

//On game Start
messageHandler.on('start', (message) => {
    const {attacker, defender} = message
    let client_id = getClient_id()

    //Check what role you are, and activate your pieces depending on role
    if (client_id == attacker){
        const attackerPieces = document.querySelectorAll('.attacker')
        attackerPieces.forEach(piece => {
            piece.addEventListener('mousedown', mouseDown)
            piece.addEventListener('click', onClick);
        });
    }

    else if (client_id == defender){
        const defenderPieces = document.querySelectorAll('.defender')
        defenderPieces.forEach(piece => {
            piece.addEventListener('mousedown', mouseDown)
            piece.addEventListener('click', onClick)
        });
    }
});

//On Game end
messageHandler.on('win', () =>{
    console.log("test")
    const all_pieces = document.querySelectorAll('.piece')
    all_pieces.forEach(piece => {
        piece.removeEventListener('mousedown', mouseDown)
        piece.removeEventListener('click', onClick)
    })
})
