const Product = require('../models/Product')

const ErrorHandler=require('../util/ErrorHandler');
const catchAsyncError=require('../middlewares/catchAsyncError')
const APIFeatures=require('../util/apiFeatures')

//Create new product => /api*/vi/product/new

exports.newProduct =catchAsyncError( async (req, res, next) => {

    req.body.user = req.user.id;    

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// Get new product => /api/v1/product
exports.getProducts = catchAsyncError(async(req,res,next) =>{

    const resPerPage=4;
    const productCount = await Product.countDocuments();

    const apiFeatures=new APIFeatures(Product.find(),req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

    const products = await apiFeatures.query;
    
    res.status(200).json({
        success : true,
       count: products.length,
       productCount,
       products

    })
})

// get single product detail=> /api/v1/product/{id}

exports.getSingleProduct = catchAsyncError(async(req, res, next) =>{

    const product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler('Product not found',404));
    }

    res.status(200).json({
        success : true,
        product
    })

})

// update new product => /api/v1/product/:id

exports.updateProduct = catchAsyncError(async(req, res, next) =>{

    let product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler('Product not found',404));
    }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true,
        useFindAndModify:false
    });

    res.status(200).json({
        success : true,
        product
    })
})

// Delete product => /api/v1/product/:id

exports.deleteProduct = catchAsyncError(async(req, res, next) =>{

    const product = await Product.findById(req.params.id)

    if(!product)
    {
        return next(new ErrorHandler('Product not found',404));
    }

    await product.remove();

    res.status(200).json({
        success : true,
        message:'Product is deleted'
    })
})