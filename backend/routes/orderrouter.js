import expressAsyncHandler from 'express-async-handler';
import express from 'express'; 
import Order from '../models/ordermodel.js';
import User from '../models/usermodel.js';
import { isAuth ,isAdmin } from '../utils.js';
import Product from '../models/productmodel.js';
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


    orderRouter.get('/mine',isAuth,  
        expressAsyncHandler(async (req, res) => {
        const order = await Order.find({user:req.user._id});
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send({ message: 'Order found', order });
    })
);

// Order.find() का काम
// यह डेटाबेस के orders कलेक्शन में जाता है और वहाँ रखे प्रत्येक ऑर्डर का पूरा डॉक्यूमेंट उठाता है। इस डॉक्यूमेंट के अंदर ऑर्डर से जुड़ी हर जानकारी पहले से मौजूद होती है, जैसे:

// _id (ऑर्डर की अपनी यूनिक आईडी)

// totalPrice (कुल कीमत)

// isPaid (पेमेंट स्टेटस)

// createdAt (ऑर्डर का समय)

// user (वह फील्ड जिसमें उस ऑर्डर को करने वाले यूजर की MongoDB ObjectId स्टोर होती है)

// 2. .populate('user', 'name') का काम
// यह केवल user नामक फील्ड पर अपना जादू चलाता है। यह मोंगूज से कहता है: "इस ऑर्डर में जो user की आईडी लिखी है, उसे हटाकर उसकी जगह users कलेक्शन से उस यूजर का पूरा ऑब्जेक्ट ले आओ, लेकिन उस ऑब्जेक्ट के अंदर से हमें सिर्फ name प्रॉपर्टी ही देना।"



   //ek baat or dhyan rakhna ye sab sequemce me h /mine /:id se pahle aaya h agar baad me likh diya to :id /mine ko handle krega

   
//     User.aggregate() MongoDB और Mongoose का एक बहुत ही शक्तिशाली (powerful) फीचर है। इसका उपयोग तब किया जाता है जब आपको डेटाबेस से केवल सीधा डेटा ढूंढकर (जैसे find() से) नहीं निकालना हो, बल्कि उस डेटा पर Calculations, Grouping, Filtering, या Transformation करना हो।

// इसे MongoDB का "Data Processing Factory" या "Pipeline" कहा जाता है।

// इसे एक आसान उदाहरण से समझें (Real-life Analogy)
// मान लीजिए आपके पास एक User कलेक्शन है जिसमें सैकड़ों यूज़र्स का डेटा है।

// User.find() का काम सिर्फ इतना है: "सारे यूज़र्स की लिस्ट लाकर दे दो।"

// User.aggregate() का काम तब शुरू होता है जब आप कहें: "मुझे शहर (City) के हिसाब से यूज़र्स को Group करो, फिर गिनकर बताओ कि हर शहर में Total कितने यूज़र्स हैं, और सिर्फ उन्हीं शहरों को दिखाओ जहाँ 10 से ज़्यादा यूज़र्स रहते हैं।"

// यह काम कैसे करता है? (The Pipeline Concept)
// aggregate() एक Pipeline Array [] लेता है। इस एरे के अंदर अलग-अलग स्टेजेस (Stages) होती हैं। डेटा पहली स्टेज से गुज़रकर दूसरी स्टेज में जाता है, फिर तीसरी में—बिलकुल एक फैक्ट्री की असेंबली लाइन की तरह।

// मुख्य Stages:

// $match: डेटा को फ़िल्टर करता है (जैसे find काम करता है)।

// $group: डेटा को किसी एक फील्ड के आधार पर इकट्ठा करता है और उसपर गणना (Sum, Average, Count) करता है।

// $sort: रिज़ल्ट को एसेंडिंग या डिसेंडिंग ऑर्डर में सेट करता है।

// $project: तय करता है कि फाइनल रिज़ल्ट में कौन-सी फील्ड्स दिखानी हैं और कौन-सी छिपानी हैं।



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
                    //  _id: null: जब हम _id को null सेट करते हैं, तो इसका मतलब है कि हमें डेटा को किसी विशेष कैटेगरी (जैसे शहर या यूजर) के आधार पर अलग-अलग समूहों में नहीं बांटना है। हमें डेटाबेस के सारे रिकॉर्ड्स को एक ही ग्रुप में मिलाकर कैलकुलेशन करनी है।
                    numUsers: {$sum: 1}
                    // numUrders: { $sum: 1 }: यह डेटाबेस में मौजूद हर एक user के लिए 1 जोड़ता है। यानी यह आपको बताएगा कि वेबसाइट पर अब तक कुल कितने ऑर्डर्स (Total Orders Count) आए हैं।
                }
        }
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group:{
                    _id:{$dateToString:{format:"%Y-%m-%d",date:'$createdAt'}},
                    numOrders:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, 1, 0]}},
                    sales:{$sum:{ $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0]}},
                    // totalSales: { $sum: "$totalPrice" }: यह हर ऑर्डर के अंदर मौजूद totalPrice फ़ील्ड की वैल्यू को आपस में जोड़ता जाता है। इससे आपको पता चलता है कि आपकी वेबसाइट पर अब तक कुल कितने रुपये की बिक्री (Total Revenue/Sales) हुई है।
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