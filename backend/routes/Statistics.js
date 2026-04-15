import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get dashboard stats
router.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');
    
    // Count total businesses
    const [businessResult] = await db.query(
      'SELECT COUNT(*) as total FROM businesses'
    );
    const totalBusiness = businessResult[0].total;

    // Count total users
    const [usersResult] = await db.query(
      'SELECT COUNT(*) as total FROM users'
    );
    const totalUsers = usersResult[0].total;

    // Optional: Count businesses from last month for percentage change
    const [lastMonthBusiness] = await db.query(
      `SELECT COUNT(*) as total FROM businesses 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );
    const newBusinessThisMonth = lastMonthBusiness[0].total;
    const businessChange = totalBusiness > 0 
      ? `+${Math.round((newBusinessThisMonth / totalBusiness) * 100)}%`
      : '+0%';

    // Optional: Count users from last month
    const [lastMonthUsers] = await db.query(
      `SELECT COUNT(*) as total FROM users 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );
    const newUsersThisMonth = lastMonthUsers[0].total;
    const usersChange = totalUsers > 0 
      ? `+${Math.round((newUsersThisMonth / totalUsers) * 100)}%`
      : '+0%';

    console.log('✅ Stats fetched:', { totalBusiness, totalUsers });

    res.json({
      success: true,
      data: {
        totalBusiness,
        totalUsers,
        businessChange,
        usersChange
      }
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

export default router;