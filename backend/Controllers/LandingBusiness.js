import pool from '../config/db.js';





const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};







// ✅ NEW ENDPOINT - For Landing Page (No Limit)
export const fetchAllBusinesses = async (req, res) => {
  try {
    console.log('🔍 Fetching ALL businesses for landing page (no pagination)');

    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM businesses b
      WHERE b.status IS NOT NULL
    `);
    const totalItems = countResult[0].total;

    console.log('📊 Total businesses:', totalItems);

    // Get status statistics
    const [statusStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN LOWER(status) = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN LOWER(status) = 'inactive' THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN LOWER(status) = 'pending review' THEN 1 ELSE 0 END) as pending_review
      FROM businesses
      WHERE status IS NOT NULL
    `);

    const stats = statusStats[0];
    console.log('📈 Status statistics:', stats);

    // ✅ Fetch ALL businesses - NO LIMIT
    const [businesses] = await pool.query(`
      SELECT 
        -- Business Info
        b.Business_id,
        b.uuid as business_uuid,
        b.business_name,
        b.Description as business_description,
        b.Registration_number,
        b.Tin_Number,
        b.Business_Address,
        b.business_email,
        b.business_phone,
        b.date_established,
        b.status as business_status,
        b.created_at as business_created_at,
        b.updated_at as business_updated_at,
        b.user_id,
        
        -- Category Info
        bc.Category_id,
        bc.Business_type,
        bc.Industry,
        bc.Category_status,
        
        -- User/Owner Basic Info
        u.email as owner_email,
        u.role as owner_role,
        u.name as owner_name,
        
        -- Owner Detailed Info
        o.owners_id,
        o.gender,
        o.date_of_birth,
        o.age,
        o.address_line1,
        o.address_line2,
        o.city,
        o.state_province,
        o.postal_code,
        o.country,
        o.contact_number,
        o.alternate_contact,
        o.emergency_contact,
        o.emergency_contact_name
        
      FROM businesses b
      LEFT JOIN business_category bc ON b.Business_id = bc.Business_id
      LEFT JOIN users u ON b.user_id = u.user_id
      LEFT JOIN owners o ON b.Business_id = o.Business_id
      WHERE b.status IS NOT NULL
      ORDER BY b.created_at DESC
    `);

    console.log('📦 Fetched', businesses.length, 'businesses from database');

    // Fetch images
    const [images] = await pool.query(`
      SELECT business_id, image_id, image_path, created_at
      FROM business_images
      ORDER BY created_at ASC
    `);

    console.log('🖼️ Fetched', images.length, 'images');

    // Fetch products
    const [products] = await pool.query(`
      SELECT product_id, business_id, name, description, created_at, updated_at
      FROM products
      ORDER BY created_at DESC
    `);

    console.log('📦 Fetched', products.length, 'products');

    // ✅ ADD BASE URL FOR IMAGES
    const BASE_URL = 'http://localhost:5000'; // Change this to your server URL

    // Group images by business
    const imagesByBusiness = {};
    images.forEach(img => {
      if (!imagesByBusiness[img.business_id]) {
        imagesByBusiness[img.business_id] = [];
      }
      imagesByBusiness[img.business_id].push({
        id: img.image_id,
        path: `${BASE_URL}/${img.image_path}`, // ✅ ADD BASE URL HERE
        createdAt: img.created_at
      });
    });

    // Group products by business
    const productsByBusiness = {};
    products.forEach(prod => {
      if (!productsByBusiness[prod.business_id]) {
        productsByBusiness[prod.business_id] = [];
      }
      productsByBusiness[prod.business_id].push({
        product_id: prod.product_id,
        name: prod.name,
        description: prod.description,
        createdAt: prod.created_at,
        updatedAt: prod.updated_at
      });
    });

    // Format businesses
    const formattedBusinesses = businesses.map(business => {
      const colors = ['blue', 'green', 'purple', 'pink', 'yellow', 'gray'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const businessImages = imagesByBusiness[business.Business_id] || [];
      const businessProducts = productsByBusiness[business.Business_id] || [];
      
      const dateEstablished = business.date_established 
        ? new Date(business.date_established).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : 'N/A';

      const dateOfBirth = business.date_of_birth
        ? new Date(business.date_of_birth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A';

      let categoryString = business.Business_type || 'General';
      if (business.Industry) {
        categoryString = `${business.Business_type} • ${business.Industry}`;
      }

      return {
        id: `BUS-${business.Business_id}`,
        businessId: business.Business_id,
        uuid: business.business_uuid,
        name: business.business_name || 'Unnamed Business',
        description: business.business_description,
        status: business.business_status || 'Inactive',
        category: categoryString,
        businessType: business.Business_type,
     
        industry: business.Industry,
        categoryStatus: business.Category_status,
        categoryId: business.Category_id,
        dateLabel: 'Operating',
        date: dateEstablished,
        createdAt: business.business_created_at,
        updatedAt: business.business_updated_at,
        email: business.business_email,
        phone: business.business_phone,
        address: business.Business_Address,
        registrationNumber: business.Registration_number,
        tinNumber: business.Tin_Number,
        
        userId: business.user_id,
        ownerEmail: business.owner_email,
        ownerRole: business.owner_role,
        ownerName: business.owner_name,
        
        ownerId: business.owners_id,
        ownerGender: business.gender,
        ownerBirthday: dateOfBirth,
        ownerAge: business.age || calculateAge(business.date_of_birth),
        ownerAddress1: business.address_line1,
        ownerAddress2: business.address_line2,
        ownerCity: business.city,
        ownerProvince: business.state_province,
        ownerPostalCode: business.postal_code,
        ownerCountry: business.country,
        ownerContactNumber: business.contact_number,
        ownerAlternateContact: business.alternate_contact,
        ownerEmergencyContact: business.emergency_contact,
        ownerEmergencyContactName: business.emergency_contact_name,
        
        images: businessImages,
        mainImage: businessImages.length > 0 ? businessImages[0].path : null,
        products: businessProducts,
        
        affiliates: Math.floor(Math.random() * 50) + 1,
        revenue: '₱' + (Math.floor(Math.random() * 20000) + 1000).toLocaleString(),
        convRate: (Math.random() * 5 + 1).toFixed(1) + '%',
        commission: ['10%', '15%', '20%', '25%'][Math.floor(Math.random() * 4)],
        color: randomColor,
      };
    });

    console.log(`✅ Successfully formatted ${formattedBusinesses.length} businesses (ALL - Landing Page)`);
    
    res.status(200).json({
      businesses: formattedBusinesses,
      totalItems: totalItems,
      statistics: {
        total: parseInt(stats.total) || 0,
        active: parseInt(stats.active) || 0,
        inactive: parseInt(stats.inactive) || 0,
        pendingReview: parseInt(stats.pending_review) || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching all businesses:', error);
    res.status(500).json({ 
      message: "Error Fetching the data",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};