var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

router.post('/:id/star', auth.isAuthenticated(), controller.star);
router.delete('/:id/unstar', auth.isAuthenticated(), controller.unstar);
router.get('/:id/stars/count', controller.starsCount);
router.get('/stars/mine', auth.isAuthenticated(), controller.indexMyStars);
router.patch('/:id/star/archive', auth.isAuthenticated(), controller.archiveStar);
router.patch('/:id/star/unarchive', auth.isAuthenticated(), controller.unarchiveStar);

router.get('/:id/replies', controller.indexReplies);
router.get('/:id/replies/count', controller.repliesCount);
// router.post('/:id/replies', controller.createReply);

module.exports = router;
