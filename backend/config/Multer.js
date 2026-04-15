// In your multer configuration file (e.g., config/multer.js or middleware/upload.js)
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (file.fieldname === 'image') {
      uploadPath = 'uploads/businesses';
    } else if (file.fieldname === 'ownerImage') {
      uploadPath = 'uploads/owners';
    } else if (file.fieldname.startsWith('product_')) {
      uploadPath = 'uploads/products';
    } else {
      uploadPath = 'uploads';
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});