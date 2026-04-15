import pool from '../config/db.js';

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return null;
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const updateBusiness = async (req, res) => {
  const { id } = req.params;

  const {
    business_name,
    business_email,
    business_phone,
    Business_Address,
    Description,
    Registration_number,
    Tin_Number,
    date_established,
    status,
    Business_type,
    Industry,
    owner_name,
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
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log(`✏️ Updating business ID: ${id}`);

    // 1. Update businesses table
    await connection.query(
      `UPDATE businesses SET
        business_name       = ?,
        business_email      = ?,
        business_phone      = ?,
        Business_Address    = ?,
        Description         = ?,
        Registration_number = ?,
        Tin_Number          = ?,
        date_established    = ?,
        status              = ?,
        updated_at          = NOW()
      WHERE Business_id = ?`,
      [
        business_name,
        business_email,
        business_phone,
        Business_Address,
        Description,
        Registration_number,
        Tin_Number,
        date_established || null,
        status,
        id,
      ]
    );
    console.log('✅ businesses table updated');

    // 2. Update business_category table
    const [categoryRows] = await connection.query(
      `SELECT Category_id FROM business_category WHERE Business_id = ?`,
      [id]
    );

    if (categoryRows.length > 0) {
      await connection.query(
        `UPDATE business_category SET
          Business_type = ?,
          Industry      = ?
        WHERE Business_id = ?`,
        [Business_type, Industry, id]
      );
      console.log('✅ business_category table updated');
    } else {
      await connection.query(
        `INSERT INTO business_category (Business_id, Business_type, Industry) VALUES (?, ?, ?)`,
        [id, Business_type, Industry]
      );
      console.log('✅ business_category row inserted');
    }

    // 3. Get user_id from businesses
    const [businessRows] = await connection.query(
      `SELECT user_id FROM businesses WHERE Business_id = ?`,
      [id]
    );

    if (businessRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Business not found' });
    }

    const userId = businessRows[0].user_id;

    // 4. Update users table (owner name)
    if (owner_name) {
      await connection.query(
        `UPDATE users SET name = ? WHERE user_id = ?`,
        [owner_name, userId]
      );
      console.log('✅ users table updated');
    }

    // 5. Sanitize age - prevent NaN in SQL
    const parsedAge = parseInt(age);

    // 6. Sanitize date_of_birth - frontend may send formatted string e.g. "May 11, 2013"
    let cleanDob = null;
    if (date_of_birth) {
      const parsed = new Date(date_of_birth);
      if (!isNaN(parsed.getTime())) {
        cleanDob = parsed.toISOString().split('T')[0]; // YYYY-MM-DD
      }
    }

    const computedAge = !isNaN(parsedAge) ? parsedAge : calculateAge(cleanDob);

    // 7. Update owners table - keyed by Business_id (per schema)
    const [ownerRows] = await connection.query(
      `SELECT owners_id FROM owners WHERE Business_id = ?`,
      [id]
    );

    if (ownerRows.length > 0) {
      await connection.query(
        `UPDATE owners SET
          gender                 = ?,
          date_of_birth          = ?,
          age                    = ?,
          address_line1          = ?,
          address_line2          = ?,
          city                   = ?,
          state_province         = ?,
          postal_code            = ?,
          country                = ?,
          contact_number         = ?,
          alternate_contact      = ?,
          emergency_contact      = ?,
          emergency_contact_name = ?
        WHERE Business_id = ?`,
        [
          gender || null,
          cleanDob,
          computedAge,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state_province || null,
          postal_code || null,
          country || null,
          contact_number || null,
          alternate_contact || null,
          emergency_contact || null,
          emergency_contact_name || null,
          id,
        ]
      );
      console.log('✅ owners table updated');
    } else {
      await connection.query(
        `INSERT INTO owners
          (Business_id, user_id, gender, date_of_birth, age,
           address_line1, address_line2, city, state_province,
           postal_code, country, contact_number, alternate_contact,
           emergency_contact, emergency_contact_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          gender || null,
          cleanDob,
          computedAge,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state_province || null,
          postal_code || null,
          country || null,
          contact_number || null,
          alternate_contact || null,
          emergency_contact || null,
          emergency_contact_name || null,
        ]
      );
      console.log('✅ owners row inserted');
    }

    await connection.commit();
    console.log(`🎉 Business ${id} fully updated`);

    res.status(200).json({
      message: 'Business updated successfully',
      businessId: id,
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error updating business:', error);
    res.status(500).json({
      message: 'Error updating business',
      error: error.message,
    });
  } finally {
    connection.release();
  }
};