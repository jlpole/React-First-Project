import express from 'express';
import pool from '../config/db.js';

import { authenticateToken as verifyToken, authorizeRoles } from '../middleware/auth.js';
import { register, login, logout, MarketerRegister } from '../Controllers/Auth.js'; 

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)
router.post('/Marketer/Register', MarketerRegister)

// Get current user (protected route)
router.get('/Browser', verifyToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin only route (example)
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!', user: req.user });
});

// Admin or Moderator route (example)
router.get('/Member', verifyToken, authorizeRoles('admin', 'Member'), (req, res) => {
    res.json({ message: 'Welcome Moderator or Admin!', user: req.user });
});

export default router;