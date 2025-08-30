const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: false }))

router.get('/', (req, res) => {
    res.render("login");
})

router.post('/', (req, res) => {
})

module.exports = router;
