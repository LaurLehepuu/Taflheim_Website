const express = require('express');
const middlewares = require('../middleware')
const method_override = require('method-override')

const router = express.Router()
router.use(method_override('_method'))

router.delete('/', middlewares.checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
    })
    res.redirect('/login')
})

module.exports = router
