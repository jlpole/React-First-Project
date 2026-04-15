import pool from '../config/db.js';
import { generateUUID } from '../utils/Helper.js';

export const Create = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();
    
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const {
      businessName,
      email,
      phone,
      dateEstablished,
      businessType,
      industry,
      businessDescription,
      address,
      city,
      state,
      country,
      zipcode,
      productCount,
      registrationNumber,   // ✅ ADDED
      tinNumber,            // ✅ ADDED
    } = req.body;
    
    const userId = req.user?.id || null;
    
    // Build full address with city, state, country, zipcode
    const fullAddress = [address, city, state, country, zipcode]
      .filter(Boolean)
      .join(', ') || null;

    // Parse products with descriptions
    const products = [];
    for (let i = 0; i < parseInt(productCount || 0); i++) {
      const product = {
        name: req.body[`product_${i}_name`],
        description: req.body[`product_${i}_description`] || '',
        images: []
      };
      
      // Get product images
      req.files?.forEach(file => {
        if (file.fieldname === `product_${i}_images`) {
          product.images.push(file.path);
        }
      });
      
      products.push(product);
    }
    
    // Get business images
    const businessImages = req.files
      ?.filter(file => file.fieldname === 'business_images')
      .map(file => file.path) || [];
    
    console.log('Parsed products:', products);
    console.log('Business images:', businessImages);

    // 1. INSERT Business ✅ UPDATED with Registration_number, Tin_Number, full address fields
    const [businessResult] = await connection.query(
      `INSERT INTO businesses 
      (uuid, business_name, business_email, business_phone, date_established, 
       Registration_number, Tin_Number, Description, Business_Address,
       status, user_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        generateUUID(),
        businessName,
        email,
        phone,
        dateEstablished || null,
        registrationNumber || null,   // ✅ ADDED
        tinNumber || null,            // ✅ ADDED
        businessDescription,
        fullAddress,                  // ✅ Combined full address
        'Active',
        userId  
      ]
    );

    const businessId = businessResult.insertId;
    console.log('✅ Business inserted with ID:', businessId);

    // 2. Insert Category BEFORE owners
    const [categoryResult] = await connection.query(
      `INSERT INTO business_category 
      (uuid, Business_id, Business_type, Industry, Category_status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        generateUUID(),
        businessId, 
        businessType, 
        industry, 
        'Active'
      ]
    );

    const categoryId = categoryResult.insertId;
    console.log('✅ Business category inserted with ID:', categoryId);

    // 3. Insert Owner
    await connection.query(
      `INSERT INTO owners (uuid, Business_id, user_id, Category_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [generateUUID(), businessId, userId, categoryId]
    );
    console.log('✅ Owner relationship inserted');
    
    // 4. INSERT business images
    for (let i = 0; i < businessImages.length; i++) {
      const imagePath = businessImages[i];
      
      await connection.query(
        `INSERT INTO business_images 
        (business_id, image_path, created_at) 
        VALUES (?, ?, NOW())`,
        [businessId, imagePath]
      );
      
      console.log(`✅ Business image ${i + 1} inserted:`, imagePath);
    }
    
    // 5. INSERT products and their images
    let totalProductImages = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      if (product.name && product.name.trim() !== '') {
        // Insert product
        const [productResult] = await connection.query(
          `INSERT INTO products 
          (business_id, name, description, created_at, updated_at) 
          VALUES (?, ?, ?, NOW(), NOW())`,
          [businessId, product.name, product.description || null]
        );
        
        const productId = productResult.insertId;
        console.log(`✅ Product ${i + 1} inserted:`, product.name, 'with ID:', productId);
        
        // Insert product images
        if (product.images && product.images.length > 0) {
          for (let j = 0; j < product.images.length; j++) {
            const imagePath = product.images[j];
            const isPrimary = (j === 0) ? 1 : 0;
            
            // Insert into business_images first
            const [imageResult] = await connection.query(
              `INSERT INTO business_images 
              (business_id, image_path, created_at) 
              VALUES (?, ?, NOW())`,
              [businessId, imagePath]
            );
            
            const imageId = imageResult.insertId;
            
            // Then insert into product_images
            await connection.query(
              `INSERT INTO product_images 
              (image_id, product_id, business_id, image_path, is_primary, created_at) 
              VALUES (?, ?, ?, ?, ?, NOW())`,
              [imageId, productId, businessId, imagePath, isPrimary]
            );
            
            totalProductImages++;
            console.log(`  ✅ Product image ${j + 1} inserted for product ${productId}`);
          }
        }
      }
    }
    
    console.log(`✅ Total product images inserted: ${totalProductImages}`);
    
    // Commit transaction
    await connection.commit();
    console.log('✅ Transaction committed successfully!');
    
    res.json({ 
      success: true, 
      message: 'Business created successfully!',
      data: {
        businessId,
        businessName,
        registrationNumber: registrationNumber || null,
        tinNumber: tinNumber || null,
        productsCount: products.filter(p => p.name && p.name.trim()).length,
        businessImagesCount: businessImages.length,
        productImagesCount: totalProductImages
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error creating business:', error);
    console.error('Error details:', error.message);
    console.error('SQL Error:', error.sql);
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error.sql || error.toString()
    });
  } finally {
    connection.release();
  }
};