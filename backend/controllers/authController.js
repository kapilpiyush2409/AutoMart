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

    const token = user.getJwtToken()

    res.status(201).json({
        success : true,
        token
    })

})
//login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async(req,res,next) =>{
    const {email,password} = req.body

    //checks if email and password is enter by user

    if(!email || !password) {
        return next(new ErrorHandler('please enter your eamil & password',400))

    }

    // finding user in db

    const user = await User.findOne({email}).select('+password')
    
    if(!user){
        return next(new ErrorHandler('Invalid Email or Password',401));
    }

    // check if p is correct or not
    const isPasswordMatched =await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password',401));
    }
    const token =user.getJwtToken();
    res.status(200).json({
        success: true,
        token
        })
})