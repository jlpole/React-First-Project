import pool from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AddBusiness = async (req, res) => {
  const connection = await pool.getConnection();
  console.log("Received body:", req.body);
  console.log("Received files:", req.files?.map(f => f.fieldname));
  console.log("User from token:", req.user?.id);
  
  try {
    await connection.beginTransaction();

    const {
      // Business Information
      business_name,
      business_email,
      business_phone,
      description,
      category,
      industry,
      business_address,
      tin_number,
      registration_number,
      date_established,
      
      // Owner Information
      ownerName,
      ownerEmail,
      ownerContactNumber,
      ownerGender,
      ownerDateOfBirth,
      ownerAge,
      ownerAddressLine1,
      ownerAddressLine2,
      ownerCity,
      ownerStateProvince,
      ownerPostalCode,
      ownerCountry,
      ownerAlternateContact,
      ownerEmergencyContact,
      ownerEmergencyContactName,
      ownerComment,
      
      // Products data (JSON string)
      products
    } = req.body;

    const userId = req.user.id; // From authenticated token

    // Validation
    const errors = {};

    // Business validations
    if (!business_name?.trim()) {
      errors.business_name = 'Business name is required';
    }

    if (!business_email?.trim()) {
      errors.business_email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(business_email)) {
      errors.business_email = 'Invalid email format';
    }

    if (!business_phone?.trim()) {
      errors.business_phone = 'Business phone is required';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!business_address?.trim()) {
      errors.business_address = 'Business address is required';
    }

    if (!date_established) {
      errors.date_established = 'Date established is required';
    }

    // Owner validations
    if (!ownerName?.trim()) {
      errors.ownerName = 'Owner name is required';
    }

    if (ownerEmail && !/\S+@\S+\.\S+/.test(ownerEmail)) {
      errors.ownerEmail = 'Invalid email format';
    }

    if (!ownerAddressLine1?.trim()) {
      errors.ownerAddressLine1 = 'Owner address is required';
    }

    if (Object.keys(errors).length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check if business email already exists
    const [existingBusiness] = await connection.query(
      'SELECT Business_id FROM businesses WHERE business_email = ?',
      [business_email]
    );

    if (existingBusiness.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'A business with this email already exists',
        errors: {
          business_email: 'This email is already registered'
        }
      });
    }

    // Generate UUID for business
    const [uuidResult] = await connection.query('SELECT UUID() as uuid');
    const businessUuid = uuidResult[0].uuid;

    // Handle business image upload - ✅ FIXED PATH FORMAT
    let businessImagePath = null;
    const businessImageFile = req.files?.find(file => file.fieldname === 'image');
    if (businessImageFile) {
      // Remove leading slash to match server setup
      businessImagePath = `uploads/businesses/${businessImageFile.filename}`;
      console.log('📸 Business image path:', businessImagePath);
    }

    // Insert into businesses table - ALWAYS SET STATUS TO 'Active'
    const insertBusinessQuery = `
      INSERT INTO businesses (
        uuid,
        business_name,
        Description,
        Registration_number,
        Tin_Number,
        Business_Address,
        business_email,
        business_phone,
        date_established,
        status,
        user_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, NOW(), NOW())
    `;

    const [businessResult] = await connection.query(insertBusinessQuery, [
      businessUuid,
      business_name,
      description || null,
      registration_number || null,
      tin_number || null,
      business_address,
      business_email,
      business_phone,
      date_established,
      userId
    ]);

    const businessId = businessResult.insertId;
    console.log('✅ Business inserted with ID:', businessId);

    // Insert into business_category table
    const insertCategoryQuery = `
      INSERT INTO business_category (
        uuid,
        Business_type,
        Industry,
        Category_status,
        Business_id,
        created_at,
        updated_at
      ) VALUES (UUID(), ?, ?, 'Active', ?, NOW(), NOW())
    `;

    const [categoryResult] = await connection.query(insertCategoryQuery, [
      category,
      industry || null,
      businessId
    ]);

    const categoryId = categoryResult.insertId;
    console.log('✅ Business category inserted with ID:', categoryId);

    // Handle owner image upload
    let ownerImageId = null;
    const ownerImageFile = req.files?.find(file => file.fieldname === 'ownerImage');
    if (ownerImageFile) {
      const ownerImagePath = `uploads/owners/${ownerImageFile.filename}`;
      console.log('📸 Owner image path:', ownerImagePath);
      
      // Insert into business_images table for owner
      const [ownerImageResult] = await connection.query(
        'INSERT INTO business_images (image_path, business_id, created_at) VALUES (?, ?, NOW())',
        [ownerImagePath, businessId]
      );
      
      ownerImageId = ownerImageResult.insertId;
      console.log('✅ Owner image inserted with ID:', ownerImageId);
    }

    // Insert into owners table with complete information
    const insertOwnerQuery = `
      INSERT INTO owners (
        uuid,
        Business_id,
        user_id,
        Category_id,
        image_id,
        gender,
        date_of_birth,
        age,
        address_line1,
        address_line2,
        city,
        state_province,
        postal_code,
        country,
        contact_number,
        alternate_contact,
        emergency_contact,
        emergency_contact_name,
        comment,
        created_at,
        updated_at
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await connection.query(insertOwnerQuery, [
      businessId,
      userId,
      categoryId,
      ownerImageId,
      ownerGender || null,
      ownerDateOfBirth || null,
      ownerAge || null,
      ownerAddressLine1,
      ownerAddressLine2 || null,
      ownerCity || null,
      ownerStateProvince || null,
      ownerPostalCode || null,
      ownerCountry || null,
      ownerContactNumber || null,
      ownerAlternateContact || null,
      ownerEmergencyContact || null,
      ownerEmergencyContactName || null,
      ownerComment || null
    ]);
    console.log('✅ Owner inserted');

    // ✅ INSERT BUSINESS IMAGE BEFORE PRODUCTS
    if (businessImagePath) {
      await connection.query(
        'INSERT INTO business_images (image_path, business_id, created_at) VALUES (?, ?, NOW())',
        [businessImagePath, businessId]
      );
      console.log('✅ Business image inserted to business_images table');
    }

    // Handle Products
    if (products) {
      try {
        const productsArray = JSON.parse(products);
        console.log('📦 Processing products:', productsArray.length);
        
        for (let i = 0; i < productsArray.length; i++) {
          const product = productsArray[i];
          
          if (product.name && product.name.trim()) {
            // Insert product
            const insertProductQuery = `
              INSERT INTO products (
                business_id,
                name,
                description,
                created_at,
                updated_at
              ) VALUES (?, ?, ?, NOW(), NOW())
            `;
            
            const [productResult] = await connection.query(insertProductQuery, [
              businessId,
              product.name,
              product.description || null
            ]);
            
            const productId = productResult.insertId;
            console.log(`✅ Product ${i + 1} inserted:`, product.name, 'with ID:', productId);
            
            // Handle product images
            const productImages = req.files?.filter(file => 
              file.fieldname.startsWith(`product_${i}_image_`)
            );
            
            if (productImages && productImages.length > 0) {
              for (let j = 0; j < productImages.length; j++) {
                const imageFile = productImages[j];
                const imagePath = `uploads/products/${imageFile.filename}`;
                
                // First insert into business_images to get image_id
                const [imageResult] = await connection.query(
                  'INSERT INTO business_images (image_path, business_id, created_at) VALUES (?, ?, NOW())',
                  [imagePath, businessId]
                );
                
                const imageId = imageResult.insertId;
                
                // Then insert into product_images with the image_id
                const isPrimary = (j === 0) ? 1 : 0;
                await connection.query(
                  'INSERT INTO product_images (image_id, product_id, business_id, image_path, is_primary, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                  [imageId, productId, businessId, imagePath, isPrimary]
                );
                
                console.log(`  ✅ Product image ${j + 1} inserted for product ${productId}`);
              }
            }
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing products:', parseError);
        // Continue without products if parsing fails
      }
    }

    await connection.commit();
    console.log('✅ Transaction committed successfully!');

    // Fetch the complete business data to return
    const [newBusiness] = await connection.query(`
      SELECT 
        b.Business_id as id,
        b.uuid,
        b.business_name as name,
        b.business_email as email,
        b.business_phone as phone,
        b.Description as description,
        b.Business_Address as address,
        b.Tin_Number as tinNumber,
        b.Registration_number as registrationNumber,
        b.date_established as dateEstablished,
        b.status,
        bc.Business_type as businessType,
        bc.Industry as industry,
        GROUP_CONCAT(DISTINCT bi.image_path) as images,
        DATE_FORMAT(b.created_at, '%Y-%m-%d') as createdAt,
        (SELECT COUNT(*) FROM products WHERE business_id = b.Business_id) as productCount
      FROM businesses b
      LEFT JOIN business_category bc ON b.Business_id = bc.Business_id
      LEFT JOIN business_images bi ON b.Business_id = bi.business_id
      WHERE b.Business_id = ?
      GROUP BY b.Business_id
    `, [businessId]);

    res.status(201).json({
      success: true,
      message: 'Business added successfully with complete information',
      data: {
        business: newBusiness[0],
        ownerInfo: {
          name: ownerName,
          email: ownerEmail,
          contactNumber: ownerContactNumber,
          address: `${ownerAddressLine1}${ownerAddressLine2 ? ', ' + ownerAddressLine2 : ''}`,
          city: ownerCity,
          country: ownerCountry
        }
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error adding business:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the business',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};