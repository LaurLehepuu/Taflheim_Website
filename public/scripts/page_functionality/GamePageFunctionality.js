const hide_button = document.getElementById("hide-btn")
const back_button = document.getElementById("back-btn")
const gameOverCard = document.getElementById('game-over-reason-card');
const base_url = window.location.origin
//Back Button functionality
back_button.addEventListener('click', () => {
        window.location.replace(`${base_url}/play`)
})

//Hide button functionality
hide_button.addEventListener('click', () => {
    gameOverCard.style.display = 'none';
})
