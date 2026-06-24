import expressAsyncHandler from 'express-async-handler';
import express from 'express'; 
import Order from '../models/ordermodel.js';
import User from '../models/usermodel.js';
import { isAuth } from '../utils.js';
const orderRouter = express.Router();
 
orderRouter.post('/',isAuth, //isAuth is a middleware function responsiblr for checking user is logged in or not
    expressAsyncHandler(async (req, res) => {
        const neworder = new Order({
            orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), 
            shippingAddress: {
                fullName: req.body.shippingAddress.fullname || req.body.shippingAddress.fullName,
                address: req.body.shippingAddress.address,
                city: req.body.shippingAddress.city,
                postalCode: req.body.shippingAddress.postalcode || req.body.shippingAddress.postalCode,
                country: req.body.shippingAddress.country,
            },  //ham seedhha shippingAddress: req.body.shippingAddress,nhi use kr paaye kyoki hamara frontend and backend database me  फ्रंटेंड से आने वाले डेटा और बैकएंड डेटाबेस स्कीमा (Schema) के नाम अलग थे।दोनों में अंतर यह था:डेटाबेस स्कीमा (ढूँढ रहा था)फ्रंटेंड डेटा (भेज रहा था)fullName (Capital 'N')fullname (Small 'n')postalCode (Capital 'C')postalcode (Small 'c')
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });
          
        const createdOrder = await neworder.save();
        res.status(201).send({ message: 'new Order created successfully', order: createdOrder });
        })
    );

   orderRouter.get('/:id',isAuth,  
        expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send({ message: 'Order found', order });
    })
);


orderRouter.put('/:id/pay',isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        order.paidAt = Date.now();
        order.isPaid = true;
        order.paymentResult={
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.email_address,
        }
        const updatedOrder = await order.save();
        res.status(200).send({ message: 'Order paid successfully', order: updatedOrder });
    })
);
export default orderRouter; 