const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/login', adminController.login);
router.get('/teams', auth, adminController.getAllTeams);
router.post('/complete-round', auth, adminController.completeRound);
router.delete('/team/:teamId', auth, adminController.deleteTeam);
router.put('/team/:teamId', auth, adminController.updateTeam);
router.get('/export', auth, adminController.exportToExcel);
router.get('/export-registrations', auth, adminController.exportRegistrationDetails);

module.exports = router;
