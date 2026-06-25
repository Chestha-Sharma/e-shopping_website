import express from 'express';
import Product from '../models/productmodel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth , isAdmin } from '../utils.js';
const productRouter = express.Router();
productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});



productRouter.post('/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
      const newProduct = new Product({
          name : 'sample product'+Date.now(),
          slug : 'sample-product'+Date.now(),
          image : '/images/p1.jpg',
          price : 0,
          countInStock : 0,
          brand : 'sample brand',
          rating : 0,
          numReviews : 0,
          description : 'sample description',
          category : 'sample category'
      });
      const createdProduct = await newProduct.save();
      res.status(201).send({ message: 'new Product created successfully', product: createdProduct });
  })
)
 
productRouter.put('/:id', 
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req,res)=>{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(product){
          product.name = req.body.name;
          product.price = req.body.price;
          product.description = req.body.description;
          product.image = req.body.image;
          product.category = req.body.category;
          product.brand = req.body.brand;
          product.countInStock = req.body.countInStock;
          product.rating = req.body.rating;
          product.numReviews = req.body.numReviews;
          await product.save();
          res.send({message : 'Product Updated Successfully'});
        } else{
          res.status(404).send({message : 'Product Not Found'});
        }
  }) 
);
const PAGE_SIZE = 3;


productRouter.get('/admin' , isAuth ,isAdmin, expressAsyncHandler (async (req, res) => {
       const { query } = req;
       const page = query.page || 1;
       const pageSize = query.pageSize || PAGE_SIZE;


       const products = await Product.find({}).skip(pageSize * (page - 1)).limit(pageSize);
//        1. .limit(pageSize) क्या करेगा?
// यह तय करता है कि एक बार में डेटाबेस से अधिकतम (Maximum) कितने प्रोडक्ट्स बाहर निकालने हैं।

// अगर आपके pageSize की वैल्यू 3 है, तो इसका मतलब है कि एक पन्ने पर सिर्फ 3 प्रोडक्ट्स ही दिखाई देंगे, चाहे डेटाबेस में 100 प्रोडक्ट्स क्यों न हों।

// 2. .skip(pageSize * (page - 1)) क्या करेगा?
// यह तय करता है कि नया डेटा दिखाने से पहले शुरुआत के कितने प्रोडक्ट्स को छोड़कर (Skip करके) आगे बढ़ना है। यह सीधे आपकी करंट page वैल्यू पर निर्भर करता है।

// आइए गणित (Math) लगाकर देखते हैं कि अलग-अलग पेजेस पर यह कैसे काम करेगा (मान लेते हैं कि pageSize = 3 है):

const countProducts = await Product.countDocuments();
// Product.find().skip().limit() $\rightarrow$ स्क्रीन पर दिखाने के लिए सिर्फ 3 प्रोडक्ट्स ढूंढकर लाता है।Product.countDocuments() $\rightarrow$ डेटाबेस में रखे सारे प्रोडक्ट्स को गिनता है ताकि नीचे पेजिनेशन के बटन्स की सही संख्या तय की जा सके।
   res.send({
     products,
     countProducts,
     page,
     pages: Math.ceil(countProducts / pageSize),
   });
}));
productRouter.get('/search', expressAsyncHandler (async (req, res) => {
  const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder = //1 = accending -1 = descending
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
}));

productRouter.get(
  '/categories',expressAsyncHandler(async (req,res)=>{
     const categories = await Product.distinct('category');//distinct used to return unique categories not duplicate
     res.send(categories);
  }) 
);
productRouter.get('/slug/:slug', async (req, res) => { //by :slug user can access the product details page by clicking on the product image or name and then we can use that slug to fetch the product details from the backend and show it on the product details page.
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' }); //ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
  } 
});

productRouter.get('/:id', async (req, res) => {
  try {
    // Product.findBy ko badal kar Product.findById kar diya gaya hai
    const product = await Product.findById(req.params.id); 
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    } 
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default productRouter;