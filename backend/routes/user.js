const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require('../models/User');


// GET /user/profile - Get authenticated user's profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                profilePhoto: req.user.profilePhoto,
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Get all users
router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude password field
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;