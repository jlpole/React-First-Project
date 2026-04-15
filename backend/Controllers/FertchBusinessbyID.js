import pool from '../config/db.js'; 
import authMiddleware from '../middleware/auth.js';

export const fethbusinessbyID = async (req, res) => {
  const user_id = req.user.id;
  
  // ✅ Get pagination parameters from query string
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  
  try {
    // 1. Get total count first
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM businesses WHERE user_id = ?`,
      [user_id]
    );
    const totalBusinesses = countResult[0].total;
    const totalPages = Math.ceil(totalBusinesses / limit);
    
    // 2. Get paginated businesses with category
    const [businesses] = await pool.query(
      `SELECT 
         b.*,
         bc.Business_type,
         bc.Industry,
         bc.Category_status
       FROM businesses b
       LEFT JOIN business_category bc ON b.Business_id = bc.Business_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );
    
    console.log(`✅ Found ${businesses.length} businesses for user ${user_id} (Page ${page}/${totalPages})`);
    console.log('📋 Businesses:', businesses);
    
    // 3. Get ALL images for these businesses
    const businessIds = businesses.map(b => b.Business_id);
    
    if (businessIds.length > 0) {
      const [images] = await pool.query(
        `SELECT business_id, image_path, created_at 
         FROM business_images 
         WHERE business_id IN (?)`,
        [businessIds]
      );

      // 4. Group images by business_id
      const imagesByBusiness = {};
      images.forEach(img => {
        if (!imagesByBusiness[img.business_id]) {
          imagesByBusiness[img.business_id] = [];
        }
        imagesByBusiness[img.business_id].push(img);
      });

      // 5. Attach images to each business
      businesses.forEach(business => {
        business.images = imagesByBusiness[business.Business_id] || [];
      });
    }

    // ✅ Return paginated response
    console.log('📤 Sending to frontend:', JSON.stringify(businesses, null, 2));
    res.json({
      businesses,
      pagination: {
        currentPage: page,
        totalPages,
        totalBusinesses,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ Response: "Error Fetching Businesses" });
  }
};