const mongoose=require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter a product name'],
        trim: true,
        maxLength: [100,'product name  cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true,'Please enter product prices'],
        maxLength: [5,'product prices cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true,'Please enter a product description'],

    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type:String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true,'please select category for this product'],
        enum: {
            values : [
                'Low voltage',
                'auxiliary electrical system',
                ' electronics',
                'Interior',
                'Power-train',
                'chassis',
                'Miscellaneous auto parts',
                'test','test1','test3','test4','test5','test6'
            ],
            messages: 'Please select correct category for this product'
        }
    },
    seller: {
        type:String,
        required: [true,'Please enter product seller']
    },
    stock: {
        type:Number,
        required: [true,'Please enter product stock'],
        maxLength: [5,'please name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type : Number,
        default :0
    },
    reviews: {
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports=mongoose.model('Product',productSchema);