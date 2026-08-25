import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import seedRouter from './routes/seedrouter.js'; 
import productRouter from './routes/productrouter.js';
import userRouter from './routes/userrouter.js';
import orderRouter from './routes/orderrouter.js';
import uploadRouter from './routes/uploadrouter.js';  

const app = express();
 
app.use(cors({
  origin: 'https://e-shopping-website-rho.vercel.app',
  credentials: true,
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
dotenv.config(); 
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to atlas cloud DB');
  } catch (err) {
    console.log('Database Connection Error:', err);
  }
};
connectdb(); 
const PORT = process.env.PORT;  
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);  
app.use('/api/order', orderRouter);
app.use('/api/upload', uploadRouter);
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});  
app.use((err, req, res, next) => {
   res.status(500).send({ message: err.message });   
}); 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});