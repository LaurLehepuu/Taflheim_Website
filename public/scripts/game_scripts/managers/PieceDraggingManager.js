import { attemptToMovePiece, getPossibleMoves, toggleShowPossibleMoves } from "./BoardManager.js";

let newX = 0, newY = 0, startX = 0, startY = 0;
let activePiece = null;
let hoveredSquare = null;
var possible_moves = [];

export function mouseDown(e) {
    e.preventDefault();
    activePiece = e.target;
    let activeParent = activePiece.parentNode;
    startX = e.clientX;
    startY = e.clientY;
    possible_moves = getPossibleMoves([activeParent.dataset.y, activeParent.dataset.x].map(Number));
    toggleShowPossibleMoves(possible_moves, true);
    // Get the piece's current position relative to its parent
    const rect = activePiece.getBoundingClientRect();
    const parentRect = activePiece.parentNode.getBoundingClientRect();

    activePiece.style.position = 'absolute';
    activePiece.style.left = (rect.left - parentRect.left) + 'px';
    activePiece.style.top = (rect.top - parentRect.top) + 'px';
    activePiece.style.zIndex = 1000;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    if (!activePiece) return;
    
    e.preventDefault();
    newX = e.clientX - startX;
    newY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    
    // Move the piece
    activePiece.style.left = (activePiece.offsetLeft + newX) + 'px';
    activePiece.style.top = (activePiece.offsetTop + newY) + 'px';

    //Set pointer events to none to prevent obstructing square hover
    activePiece.style.pointerEvents = 'none';
}

async function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);

    const activeParent = activePiece.parentNode;
    const [active_y, active_x] = [activeParent.dataset.y, activeParent.dataset.x].map(Number);

    if (activePiece.parentNode === hoveredSquare) {
        resetStyles(activePiece);
        return;
        
    }
    if (activePiece && hoveredSquare !== activePiece.parentNode && hoveredSquare) {
        if (await attemptToMovePiece(possible_moves, [active_y, active_x].map(Number), [hoveredSquare.dataset.y, hoveredSquare.dataset.x].map(Number))) {
            console.log('Piece moved to:', hoveredSquare);
            hoveredSquare.appendChild(activePiece);
        }
    }

    resetStyles(activePiece);
    toggleShowPossibleMoves(possible_moves, false);
    activePiece = null;
    
}

export function mouseEnter(e) {
    if ((!hoveredSquare)) {
        hoveredSquare = e.target;
        hoveredSquare.addEventListener('mouseleave', mouseLeave);
    }
}

function mouseLeave(e) {
    if (hoveredSquare) {
        hoveredSquare.style.backgroundColor = '';
        hoveredSquare.removeEventListener('mouseleave', mouseLeave);
        hoveredSquare = null;
    }
}


export async function onClick(e) {
    e.preventDefault();
    const targetSquare = e.currentTarget;
    const activeParent = activePiece ? activePiece.parentNode : null;
    const [active_y, active_x] = [activeParent.dataset.y, activeParent.dataset.x];
    const [target_y, target_x] = [targetSquare.dataset.y, targetSquare.dataset.x];
    // Only move if the target is a square and not the piece itself
    if (activePiece && targetSquare !== activePiece.parentNode && targetSquare.classList.contains('square')) {
        if (await attemptToMovePiece(possible_moves, [active_y, active_x].map(Number), [target_y, target_x].map(Number))) {
            targetSquare.appendChild(activePiece);
            resetStyles(activePiece);
            activePiece = null;
            toggleShowPossibleMoves(possible_moves, false);
        } 
        else console.log(`Invalid move from [${active_y}, ${active_x}] to [${target_y}, ${target_x}]`);
    }
}

function resetStyles(object) {
    object.style.pointerEvents = '';
    object.style.position = '';
    object.style.zIndex = '';
    object.style.left = '';
    object.style.top = '';
}
