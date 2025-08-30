const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(express.urlencoded({ extended: false }))


router.get('/', (req, res) => {
    res.render("register");
})

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
    } catch(error) {

    }
    req.body.email
})

module.exports = router;
