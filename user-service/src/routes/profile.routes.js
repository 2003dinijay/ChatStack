// src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

// All routes require authentication
router.use(authenticateToken);

// GET /api/profile/me - Get current user's profile
router.get('/me', profileController.getMyProfile);

// POST /api/profile/me - Create current user's profile
router.post('/me', profileController.createMyProfile);

// PUT /api/profile/me - Update current user's profile
router.put('/me', profileController.updateMyProfile);

// GET /api/profile/:userId - Get user's profile by userId
router.get('/:userId', profileController.getProfileByUserId);

module.exports = router;