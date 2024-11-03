const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload-photo', authMiddleware, authController.uploadPhoto);
router.get('/user', authMiddleware, authController.getUser); // New route to get user details
router.patch('/user', authMiddleware, authController.updateUser); // New route to update user details


module.exports = router;
