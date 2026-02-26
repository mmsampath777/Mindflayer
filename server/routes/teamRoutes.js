const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/register', teamController.registerTeam);
router.post('/start', teamController.startEvent);
router.get('/status/:teamId', teamController.getTeamStatus);

module.exports = router;
