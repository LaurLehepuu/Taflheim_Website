const express = require('express');
const router = express.Router();
const middlewares = require('../middleware')

router.get('/', middlewares.checkAuthenticated, (req, res) => {
    const username = req.user.username || null;
    const player_id = req.user.player_id || null;
    res.render("play", { name: username, player_id: player_id });
})

router.get('/game', middlewares.checkAuthenticated, (req, res) => {
    const username = req.user.username || "Player Name"
    const current_rating = req.user.rating || "NaN"
    res.render("game", {name: username, current_rating: current_rating});
})

module.exports = router;
