var express = require('express');
var controller = require('./state.controller');

var router = express.Router();

router.post('/', controller.create);

module.exports = router;
