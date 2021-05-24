const User = require('../models/user')

const ErrorHandler=require('../util/errorHandler');
const catchAsyncErrors= require('../middlewares/catchAsyncError');
const sendToken = require('../util/jwtToken');
const sendEmail = require('../util/sendEmail');


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

    sendToken(user,200,res)

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
    sendToken(user,200,res)
})
// Forgot password => /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async(req, res, next) =>{

    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorHandler('User is not found with this image',404));
    }

    // Get Reset token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    //Create reset password url": "

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message =`Your password reset token is as follows:\n\n${resetUrl}\n\n\If you have not
    requested this email then ignore it.`

    try {


        await sendEmail({
            email: user.email,
            subject:'AutoMart Password Recovery',
            message

        })

        res.status(200).json({
            success: true,
            message:`Email sent to: ${user.email}`
        })


    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})

        return next( new ErrorHandler(error.massage,500))
    }

}) 

// logout user => /api/v1/logout

exports.logout = catchAsyncErrors(async(req, res, next) =>{
    res.cookie('token',null,{
        expires: new Date(Date.now()), 
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})