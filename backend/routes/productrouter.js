import express from 'express';
import Product from '../models/productmodel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

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