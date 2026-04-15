import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import AuthRoutes from './routes/auth.js';
import FetchBusiness from './routes/Business.js';
import fetchAllBusinesses from './routes/Business.js';
import fethbusinessbyID from './routes/Business.js';
import Create from './routes/Business.js';
import FetchProducts from './routes/Business.js';
import interestRoutes from './routes/Interest.js';
import AddBusiness from './routes/Business.js';
import GetBusinessById from './routes/Business.js';
import Statistics from './routes/Statistics.js';
// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST!
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', AuthRoutes);
app.use('/api', FetchBusiness);
app.use('/api', AddBusiness);

app.use('/api', fetchAllBusinesses);
app.use('/api', fethbusinessbyID);
app.use('/api',Create);
app.use('/api',FetchProducts);
app.use('/api/interest', interestRoutes);
app.use(Statistics);





app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});