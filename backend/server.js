// import express from 'express';
// import data from './data.js';
// const app = express();
//  //port number set kiya taki jab bhi server start ho to ye port number use kare
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';




// // Ek saath do mongoose.connect() use karna
// // mongoose.connect() ka use tab kiya jata hai jab hum poore application ke liye ek single default connection banana chahte hain. Jab tu do baar alag-alag URI ke saath ise call karega, toh Mongoose unhe aapas me overwrite karne lagta hai ya fir error throw kar deta hai (jiske chalte connectdb1 ka .then() block execute hi nahi ho pata).
// dotenv.config(); //this is used to load the .env file and set the environment variables
// const connectdb = async () => {
//   await mongoose.connect(process.env.MONGODB_URI).then(() => {
//   console.log('Connected to atlas cloud DB');
// }).catch((err) => {
//   console.log(err);
// });
// };
// connectdb();
// const connectdb1 = async () => {
//   await mongoose.connect(process.env.MONGODB_URI1).then(() => {
//   console.log('Connected to local DB');
// }).catch((err) => {
//   console.log(err);
// });
// };
// connectdb1();
// const PORT = process.env.PORT || 5000;

// app.get('/api/products', (req, res) => {
//   res.send(data.products);
// });//backend me data.js liya taki frontend se backend se alag rakha ja sake taki data leak ki problem na create ho sake
// app.get('/api/products/slug/:slug', (req, res) => {//by :slug user can access the product details page by clicking on the product image or name and then we can use that slug to fetch the product details from the backend and show it on the product details page.
//   const product = data.products.find((x) => x.slug === req.params.slug);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
//   } 
// });
// app.get('/api/products/:id', (req, res) => {
//     const product = data.products.find((x) => x._id === req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
//   } 
// });
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });//server start karne ke liye listen method use kiya aur port number diya jisme server run karega, aur console me message print hoga jab server start ho jayega
// // npm install nodemon --save--dev used save dev because using only for development not anymore











// Approach B: Agar Dono DBs Ek Saath Chalane Hain (createConnection)
// Agar tere project ki aisi requirement hai jahan kuch collections Cloud par rahenge aur kuch Local database par, toh Mongoose me mongoose.connect ki jagah mongoose.createConnection use kiya jata hai.



import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

// Pehla connection: Atlas Cloud DB
const atlasDB = mongoose.createConnection(process.env.MONGODB_URI);
atlasDB.on('connected', () => console.log('Connected to atlas cloud DB'));
atlasDB.on('error', (err) => console.log('Atlas DB Error:', err));

// Doosra connection: Local DB
const localDB = mongoose.createConnection(process.env.MONGODB_URI1);
localDB.on('connected', () => console.log('Connected to local DB'));
localDB.on('error', (err) => console.log('Local DB Error:', err));

// NOTE: Jab tu Models banayega, toh 'mongoose.model' ki jagah:
// const Product = atlasDB.model('Product', productSchema);  -> Agar Atlas pe rkhna h
// const Log = localDB.model('Log', logSchema);              -> Agar Local pe rkhna h

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));