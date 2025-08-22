const hide_button = document.getElementById("hide-btn")
const back_button = document.getElementById("back-btn")
const gameOverCard = document.getElementById('game-over-reason-card');

//Back Button functionality
back_button.addEventListener('click', () => {
        window.location.replace('http://localhost:3000/play')
})

//Hide button functionality
hide_button.addEventListener('click', () => {
    gameOverCard.style.display = 'none';
})
