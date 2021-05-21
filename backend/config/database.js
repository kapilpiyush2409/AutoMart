const mongoose=require('mongoose');


const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlPraser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then( con  => {
        console.log('MondoDB Database connection with HOST: ${con.connection.host}')
    })
}

module.exports=connectDatabase