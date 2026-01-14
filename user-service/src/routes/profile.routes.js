
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.use(authenticateToken);


router.get('/me', profileController.getMyProfile);

router.post('/me', profileController.createMyProfile);

router.put('/me', profileController.updateMyProfile);

router.get('/:userId', profileController.getProfileByUserId);

module.exports = router;