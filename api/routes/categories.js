let express = require('express');
let router = express.Router();
const Category = require('../entities/Category')

router.get('/', async function (req, res, next) {
  const content = await Category.fetchAll();
  res.send(content);
});

module.exports = router;
