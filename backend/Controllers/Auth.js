import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';



export const MarketerRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, address, contactNumber } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Combine firstName and lastName
    const fullName = `${firstName} ${lastName}`;

    // Check if user exists by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table with combined name
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [fullName, email, hashedPassword, role || 'Marketer']
    );

    // Get the inserted user_id
    const userId = result.insertId;

    // Insert into marketers table
    await pool.query(
      'INSERT INTO marketers (user_id, address, contact_number, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [userId, address, contactNumber]
    );

    return res.status(201).json({ 
      message: 'Marketer registered successfully',
      userId: userId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};






export const register = async (req, res) => {
  try {
    const {
      email, password, name, role,
      gender, dateOfBirth, age,
      addressLine1, addressLine2,
      city, stateProvince, postalCode, country,
      contactNumber, alternateContact,
      emergencyContact, emergencyContactName, comment
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, name, role || 'Owner']
    );

    const userId = result.insertId;

    // ✅ Generate unique uuid for owners table
    const ownerUuid = uuidv4();

    await pool.query(
      `INSERT INTO owners 
        (uuid, user_id, gender, date_of_birth, age, address_line1, address_line2, 
         city, state_province, postal_code, country, contact_number, 
         alternate_contact, emergency_contact, emergency_contact_name, 
         comment, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ownerUuid,  // ✅ uuid added
        userId, gender || null, dateOfBirth || null, age || null,
        addressLine1 || null, addressLine2 || null,
        city || null, stateProvince || null,
        postalCode || null, country || null,
        contactNumber || null, alternateContact || null,
        emergencyContact || null, emergencyContactName || null,
        comment || null
      ]
    );

    res.status(201).json({ message: 'User registered successfully', userId });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  
try{
  const {email,password} = req.body;

  const [users] = await pool.query("select * from users where email=?", [email]);
console.log('User found:', users.length > 0);
console.log('Provided password:', password);
 
    if (!users || users.length === 0) {
      console.log('User not found');
      return res.status(401).json({message: "Invalid Credentials"});
    }

    const user = users[0];

    // ✅ ADD THIS CHECK to make sure password exists
    if (!user.password) {
      console.log('User has no password');
      return res.status(500).json({message: "Server error"});
    }


 const Ismatch = await bcrypt.compare(password, user.password );

 if (!Ismatch){
  console.log('Tarongag type imong credentials');
  return res.status(401).json({message:"Invalid Credentials"})
 }
 const token = jwt.sign(
  {
    id: user.user_id, 
    email: user.email, 
    role: user.role,
    tokenVersion: user.last_token_version || 0  
  },
  process.env.JWT_SECRET,
  {expiresIn: process.env.JWT_EXPIRE || '24h'}
);

res.json({
    message:'Login Successful',
    token,
    user:{
       id: user.user_id,
                email: user.email,
                role: user.role,
                expiresIn:  process.env.JWT_EXPIRE
    }
   });
} 

catch (error){
console.error(error);
res.status(500).json({message:"Error"});
}
}




export const logout = async (req, res) => {
  try {
    const userId = req.user.id; // from your auth middleware
    
    // Increment token version - automatically invalidates old tokens
    await pool.query(
      'UPDATE users SET last_token_version = last_token_version + 1 WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Logged out successfully' });
    
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





    