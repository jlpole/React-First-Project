import pool from '../config/db.js'; 

// ✅ FIXED: Using GROUP_CONCAT instead of JSON_ARRAYAGG for MySQL compatibility
export const FetchProductById = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    // First, get the product details
    const [products] = await pool.query(`
      SELECT 
        p.product_id,
        p.business_id,
        p.name AS product_name,
        p.description,
        p.created_at,
        p.updated_at,
        b.business_name,
        b.business_email,
        b.business_phone,
        b.Business_Address,
        b.Registration_number,
        b.Tin_Number,
        b.status AS business_status
      FROM businesses b
      INNER JOIN owners o ON b.Business_id = o.Business_id
      INNER JOIN products p ON p.business_id = b.Business_id
      WHERE o.user_id = ? AND p.product_id = ?
      LIMIT 1
    `, [user_id, product_id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have access"
      });
    }

    // Then, get all images for this product
    const [images] = await pool.query(`
      SELECT 
        image_id,
        image_path,
        is_primary,
        created_at
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, created_at ASC
    `, [product_id]);

    const product = {
      ...products[0],
      images: images || []
    };

    res.status(200).json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching product",
      error: error.message 
    });
  }
};

// ✅ FIXED: Main function to fetch all products with images
export const FetchProducts = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("Logged-in user ID:", user_id);

    // Step 1: Get all products for this user
    const [products] = await pool.query(`
      SELECT 
        p.product_id,
        p.business_id,
        p.name AS product_name,
        p.description,
        p.created_at,
        p.updated_at,
        b.business_name,
        b.business_email,
        b.business_phone,
        b.Business_Address,
        b.Registration_number,
        b.Tin_Number,
        b.status AS business_status
      FROM businesses b
      INNER JOIN owners o ON b.Business_id = o.Business_id
      INNER JOIN products p ON p.business_id = b.Business_id
      WHERE o.user_id = ?
      ORDER BY p.created_at DESC
    `, [user_id]);

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        count: 0
      });
    }

    // Step 2: Get product IDs
    const productIds = products.map(p => p.product_id);

    // Step 3: Get all images for these products in one query
    const [allImages] = await pool.query(`
      SELECT 
        product_id,
        image_id,
        image_path,
        is_primary,
        created_at
      FROM product_images
      WHERE product_id IN (?)
      ORDER BY product_id, is_primary DESC, created_at ASC
    `, [productIds]);

    // Step 4: Group images by product_id
    const imagesByProduct = {};
    allImages.forEach(img => {
      if (!imagesByProduct[img.product_id]) {
        imagesByProduct[img.product_id] = [];
      }
      imagesByProduct[img.product_id].push({
        image_id: img.image_id,
        image_path: img.image_path,
        is_primary: img.is_primary,
        created_at: img.created_at
      });
    });

    // Step 5: Attach images to each product
    const productsWithImages = products.map(product => ({
      ...product,
      images: imagesByProduct[product.product_id] || []
    }));

    console.log(`✅ Fetched ${productsWithImages.length} products`);

    res.status(200).json({
      success: true,
      products: productsWithImages,
      count: productsWithImages.length
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching products",
      error: error.message 
    });
  }
};