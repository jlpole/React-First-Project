import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('🔍 Token received:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion
    });
    
    // ✅ UPDATED: Get full user info including name and phone
    const [users] = await pool.query(
      `SELECT 
        u.user_id, 
        u.name, 
        u.email, 
        u.role, 
        u.last_token_version,
        m.contact_number as phone
       FROM users u 
       LEFT JOIN marketers m ON u.user_id = m.user_id 
       WHERE u.user_id = ?`,
      [decoded.id]
    );
    
    console.log('🔍 Users from DB:', users);
    
    if (users.length === 0) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // ✅ Handle undefined/null tokenVersion
    const tokenVersion = decoded.tokenVersion ?? 0;
    const dbTokenVersion = user.last_token_version ?? 0;
    
    console.log('🔍 Token version comparison:', {
      tokenVersion,
      dbTokenVersion,
      match: tokenVersion === dbTokenVersion
    });
    
    if (tokenVersion !== dbTokenVersion) {
      console.log('❌ Token version mismatch!');
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // ✅ UPDATED: Set req.user with complete user info
    req.user = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone || 'Not provided',
      role: user.role
    };
    
    console.log('✅ Authentication successful. User:', {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    });
    
    next();
    
  } catch (error) {
    console.log('❌ JWT Error:', error.name);
    console.log('❌ Error message:', error.message);
    console.log('❌ Full error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this resource'
      });
    }
    next();
  };
};

export default authenticateToken;