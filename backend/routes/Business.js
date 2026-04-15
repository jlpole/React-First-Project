import express from 'express';
import {fetchbusiness} from '../Controllers/Business.js';
import {fethbusinessbyID} from '../Controllers/FertchBusinessbyID.js';
import { authenticateToken} from '../middleware/auth.js';
import { upload } from '../config/Multer.js';
import { Create } from '../Controllers/Create.js';
import {FetchProducts} from '../Controllers/Products.js';
import {fetchAllBusinesses} from '../Controllers/LandingBusiness.js';
import { AddBusiness} from '../Controllers/AddBusiness.js';
import { updateBusiness } from '../Controllers/Updatebusiness.js'; 
const router = express.Router();

router.get('/Business', fetchbusiness);

router.post('/Business/Add', authenticateToken, upload.any(), AddBusiness);

router.put('/Business/:id', authenticateToken, updateBusiness); 




router.get('/Landing', fetchAllBusinesses);




router.get('/Business/ID', authenticateToken, fethbusinessbyID); 

router.post('/create',  authenticateToken, upload.any(), Create);
router.get ('/Products',authenticateToken, FetchProducts);
export default router; 