// import express from 'express';
// import data from './data.js';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// // Aapke variables aur route ki asli location aur contents bina badle:
// import seedRouter from './routes/seedrouter.js'; // Isko upar import karna zaroori tha taaki error na aaye
// import productRouter from './routes/productrouter.js';
// import userRouter from './routes/userrouter.js';
// import expressAsyncHandler from 'express-async-handler';
// const app = express();

// app.use(express.json()); //form data (at signin page post requests) use this and converts into json
// app.use(express.urlencoded({ extended: true }));


// // .env ko load karne ka code hamesha database connection se pehle aana chahiye
// dotenv.config(); //this is used to load the .env file and set the environment variables

// // Is line ko upar laya gaya hai taaki seedRouter load ho sake

// // Ek saath do mongoose.connect() use karna
// // mongoose.connect() ka use tab kiya jata hai java hum poore application ke liye ek single default connection banana chahte hain. Jab tu do baar alag-alag URI ke saath ise call karega, toh Mongoose unhe aapas me overwrite karne lagta hai ya fir error throw kar deta hai (jiske chalte connectdb1 ka .then() block execute hi nahi ho pata).

// const connectdb = async () => {
//   await mongoose.connect(process.env.MONGODB_URI).then(() => {
//   console.log('Connected to atlas cloud DB');
// }).catch((err) => {
//   console.log(err);
// });
// };
// connectdb();

// // const connectdb1 = async () => {
// //   // Agar aapko Atlas cloud use karna hai toh yahan MONGODB_URI kar dena, abhi aapke code ke mutabik MONGODB_URI1 rakha hai
// //   await mongoose.connect(process.env.MONGODB_URI1 || process.env.MONGODB_URI).then(() => {
// //     console.log('Connected to Database successfully!');
// //   }).catch((err) => {
// //     console.log("Database Connection Error:", err);
// //   });
// // };
// // connectdb1();

// const PORT = process.env.PORT || 5000;
// app.use('/api/seed', seedRouter);
// // app.get('/api/products', (req, res) => {
// //   res.send(data.products);
// // });//backend me data.js liya taki frontend se backend se alag rakha ja sake taki data leak ki problem na create ho sake

// app.use('/api/products', productRouter);

// app.use((err,req,res,next)=>{
//    res.status(500).send({message:err.message});   
// });
// app.use('/api/users', userRouter);
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });//server start karne ke liye listen method use kiya aur port number diya jisme server run karega, aur console me message print hoga james server start ho jayega

// // npm install nodemon --save--dev used save dev because using only for development not anymore




// // Approach B: Agar Dono DBs Ek Saath Chalane Hain (createConnection)
// // Agar tere project ki aisi requirement hai jahan kuch collections Cloud par rahenge aur kuch Local database par, toh Mongoose me mongoose.connect ki jagah mongoose.createConnection use kiya jata hai.

// // [ neeche likhe code kuchh to problem h usse thik se connect nhi ho pa rha localhost:5000/api/seed par jakar dekho kuchh gadbad show karta h neeche ke code se]

// // import express from 'express';
// // import dotenv from 'dotenv';
// // import mongoose from 'mongoose'; 
// // import seedRouter from './routes/seedrouter.js';
// // import data from './data.js';
// // dotenv.config();
// // const app = express();
// // app.use('/api/seed',seedRouter);
// // // Pehla connection: Atlas Cloud DB
// // const atlasDB = mongoose.createConnection(process.env.MONGODB_URI);
// // atlasDB.on('connected', () => console.log('Connected to atlas cloud DB'));
// // atlasDB.on('error', (err) => console.log('Atlas DB Error:', err));

// // // Doosra connection: Local DB
// // const localDB = mongoose.createConnection(process.env.MONGODB_URI1);
// // localDB.on('connected', () => console.log('Connected to local DB'));
// // localDB.on('error', (err) => console.log('Local DB Error:', err));

// // // NOTE: Jab tu Models banayega, toh 'mongoose.model' ki jagah:
// // // const Product = atlasDB.model('Product', productSchema);  -> Agar Atlas pe rkhna h
// // // const Log = localDB.model('Log', logSchema);              -> Agar Local pe rkhna h

// // const PORT = process.env.PORT || 5000;
// // app.get('/api/products', (req, res) => {
// //   res.send(data.products);
// // });//backend me data.js liya taki frontend se backend se alag rakha ja sake taki data leak ki problem na create ho sake
// // app.get('/api/products/slug/:slug', (req, res) => {//by :slug user can access the product details page by clicking on the product image or name and then we can use that slug to fetch the product details from the backend and show it on the product details page.
// //   const product = data.products.find((x) => x.slug === req.params.slug);
// //   if (product) {
// //     res.send(product);
// //   } else {
// //     res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
// //   } 
// // });
// // app.get('/api/products/:id', (req, res) => {
// //     const product = data.products.find((x) => x._id === req.params.id);
// //   if (product) {
// //     res.send(product);
// //   } else {
// //     res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
// //   } 
// // });
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import seedRouter from './routes/seedrouter.js'; 
import productRouter from './routes/productrouter.js';
import userRouter from './routes/userrouter.js';
import orderRouter from './routes/orderrouter.js';
import uploadRouter from './routes/uploadrouter.js'; 
const app = express();

//  मिडिलवेयर्स (Body Parsers)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// एनवायरनमेंट वेरिएबल्स लोड करना
dotenv.config(); 

// डेटाबेस कनेक्शन (MongoDB Atlas)
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
app.use(express.static(path.join(__dirname, '/frontend/build'))); 

 

 
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);  
app.use('/api/order', orderRouter);
app.use('/api/upload', uploadRouter);
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});  
const __dirname = path.resolve();

//Phir frontend serve karo - SABSE LAST MEIN
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
   res.status(500).send({ message: err.message });   
});
 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});