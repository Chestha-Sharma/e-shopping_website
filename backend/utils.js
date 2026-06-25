import jwt from 'jsonwebtoken';
export const generateToken = (user) => {
    return jwt.sign( { //not sent whole user for safety of password
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    } , process.env.JWT_SECRET,{
        expiresIn: '30d'
    });
}


export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.split(' ')[1] || authorization.slice(7,authorization.length);//Barer XXXXXXX
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401).send({message: 'Invalid Token'});
            }else{
                req.user = decoded;
                next();//with next we will go to of express async handler of order router
            }
        });
    }
    else{
        res.status(401).send({message: 'No Token'});
    }
}

 export const isAdmin = (req, res, next) => {
//    req.user = decoded; // ← isAuth ne req.user set kiya
// next();
    if(req.user&& req.user.isAdmin){
        next();
    }
    else{
        res.status(401).send({message: 'No Admin Access'});
    }
};