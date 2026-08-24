import expressAsyncHandler from 'express-async-handler';
import express from 'express'; 
import Order from '../models/ordermodel.js';
import User from '../models/usermodel.js';
import { isAuth ,isAdmin } from '../utils.js';
import Product from '../models/productmodel.js';
const orderRouter = express.Router();



orderRouter.post('/',isAuth,
    expressAsyncHandler(async (req, res) => {
        const neworder = new Order({
            orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), 
            shippingAddress: {
                fullName: req.body.shippingAddress.fullname || req.body.shippingAddress.fullName,
                address: req.body.shippingAddress.address,
                city: req.body.shippingAddress.city,
                postalCode: req.body.shippingAddress.postalcode || req.body.shippingAddress.postalCode,
                country: req.body.shippingAddress.country,
            }, 
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


    orderRouter.get('/mine',isAuth,  
        expressAsyncHandler(async (req, res) => {
        const order = await Order.find({user:req.user._id});
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send({ message: 'Order found', order });
    })
); 


    orderRouter.get(
   '/summary',isAuth,isAdmin,
   expressAsyncHandler( async (req,res)=>{
         const orders = await Order.aggregate([
            {
                $group:{
                    _id:null,
                    numOrders:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, 1, 0]}},
                    totalSales:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0]}},
                }
            }
         ])

    const users = await User.aggregate([
        {
            $group:{
                    _id:null,
                    numUsers: {$sum: 1}
                }
        }
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group:{
                    _id:{$dateToString:{format:"%Y-%m-%d",date:'$createdAt'}},
                    numOrders:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, 1, 0]}},
                    sales:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0]}},
                   }
        },
        {
            $sort:{
                _id:1
            }
        }
    ]);
    const productCategories = await Product.aggregate([
        {
            $group:{
                _id:"$category",
                count:{$sum:1}
            }
        }
    ]);
    res.send({users,orders,dailyOrders,productCategories});

   })
    );

    orderRouter.get('/',isAuth,isAdmin,
expressAsyncHandler(async (req,res)=>{
    const orders = await Order.find().populate('user','name');
    res.send(orders);
}));

   orderRouter.get('/:id',isAuth,  
        expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send({ message: 'Order found', order });
    })
);

orderRouter.put('/:id/deliver',isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).send({ message: 'Order delivered successfully', order: updatedOrder });
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