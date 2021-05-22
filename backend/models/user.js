const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter your name'],
        maxLength: [30,'Your name  cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true,'Please enter your email'],
        unique : true,
        validator: [validator.isEmail,'Please enter a valid email']
    },
    password: { 
        type: String,
        required: [true,'Please enter your password'],
        minLength: [6,'Your password must be 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type : String,
            required :true
        },
        url: {
            type: String,
            required : true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

})

module.exports=mongoose.model('User',userSchema);