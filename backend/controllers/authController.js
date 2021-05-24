const User = require('../models/user')

const ErrorHandler=require('../util/errorHandler');
const catchAsyncErrors= require('../middlewares/catchAsyncError');
const sendToken = require('../util/jwtToken');
const sendEmail = require('../util/sendEmail');


const crypto= require('crypto')

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
//Reset Password => /api/v1/passwod/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) =>{

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest
    ('hex')



    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400))
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))
    }

    //setup new password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res)


})

//Get currently logout in user details  => /api/v1/me
exports.getUserProfile= catchAsyncErrors(async(req, res, next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
}) 


//Update / Change password  => /api/v1/password/updates
exports.updatePassword = catchAsyncErrors(async(req, res, next) =>{

    const user = await User.findById(req.user.id).select('+password');


    //Check previous user password

    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect',400)); 
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user,200,res)

})

//update user profile  => /api/v1/me/update

exports.updateProfile = catchAsyncErrors(async(req, res, next) =>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    //update avatar 

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
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

// ADMIN routes

//get all users => /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async(req, res, next) =>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//get user details => /api/v1/admin/user/:id

exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id ${req.params.id}`))
    }

    res.status(200).json({
        success : true,
        user
    })
})
//update user profile  => /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async(req, res, next) =>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    //update avatar 

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//Delete user => /api/v1/admin/user/:id

exports.deleteUser = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id ${req.params.id}`))
    }
    //Remove avatar from 

    await user.remove();

    res.status(200).json({
        success : true,
        user
    })
})
