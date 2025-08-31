const express = require('express');
const router = express.Router();
const middlewares = require('../middleware')

router.get('/', middlewares.checkAuthenticated, (req, res) => {
    const username = req.user.username || null;
    res.render("play", { name: username });
})

router.get('/game', (req, res) => {
    res.render("game");
})

module.exports = router;
