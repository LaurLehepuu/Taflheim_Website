const express = require('express');
const passport = require('passport');
const middlewares = require('../middleware')

const router = express.Router();
router.use(express.urlencoded({ extended: false }))

router.get('/', middlewares.checkNotAuthenticated, (req, res) => {
    res.render("login");
})

router.post('/', middlewares.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/play',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router;
