const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase=require('../config/database');

const products= require('../data/products');

//setting dotenv file

dotenv.config({path:'backend/config/config.env'})

connectDatabase();

const seedProduct = async () =>{
    try{
        
        await Product.deleteMany();
        console.log('products are deleted');

        await Product.insertMany(products);
        console.log(' All products are inserted');
        
        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();
    }
}
seedProduct()