import express from 'express';
import Product from '../models/productmodel.js';
import data from '../data.js';
import User from '../models/usermodel.js';
const seedRouter = express.Router();


seedRouter.get('/', async (req, res) => {  
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(data.products); 
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({createdProducts, createdUsers}); 
}); 
export default seedRouter;


// Frontend (React) mein jab aap routes banate hain, toh aap seedha screen/component ka naam likh dete hain, kuch is tarah:

// JavaScript
// <Route path="/cart" element={<CartScreen />} />
// Lekin yahan hum Frontend (React) ki nahi, balki Backend (Node.js/Express) ki baat kar rahe hain. Dono jagah "Route" shabd ka istemal hota hai, par dono ka kaam bilkul alag hai:
// Phir Backend mein .Router() kyun use kar rahe hain?
// React mein jab aap /cart par jaate hain, toh browser bina page refresh kiye CartScreen component load kar deta hai.

// Lekin backend par koi screen ya web page nahi hota. Backend ka kaam hai logic handle karna.

// Jab aapka frontend ek request bhejega ki "Bhai, mujhe database se saare products la kar do", toh backend us request ko sunne ke liye ek rasta (route) banata hai. Agar hum express.Router() use na karein, toh hume saara database ka logic, login ka logic, aur payment ka logic ek hi file server.js mein likhna padega, jisse code khichdi ban jayega.