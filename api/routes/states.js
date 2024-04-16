let express = require('express');
let router = express.Router();
const State = require('../entities/State')

router.get('/', async function (req, res, next) {
    const content = await State.fetchAll();
    res.send(content);
});

module.exports = router;