const User = require('../models/user')

const ErrorHandler=require('../util/errorHandler');
const catchAsyncErrors= require('../middlewares/catchAsyncError');

// Register a user => api /v1/register

exports.registerUser = catchAsyncErrors(async(req, res, next) =>{

    const {name,email,password}=req.body;

    const user=await User.create({
        name,
        email,
        password,
        avatar :{
            public_id: 'Avatar/user_h1dn5t',
            url: 'https://res.cloudinary.com/dxopjqiiz/image/upload/v1621687875/AutoMart/Avatar/user_h1dn5t.png'
        }
    })

    res.status(201).json({
        success : true,
        user
    })

})