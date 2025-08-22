/* Starts the game and stops it when needed
preventing people from playing until its started */

import { messageHandler } from "../../websocket_communication/GameMessageHandler.js";
import { onClick, mouseDown } from "./PieceDraggingManager.js";

//On game Start
messageHandler.on('start', () => {
    const all_pieces = document.querySelectorAll('.piece')
    all_pieces.forEach(piece => {
            piece.addEventListener('mousedown', mouseDown);
            piece.addEventListener('click', onClick);
    });
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
