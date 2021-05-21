const app=require('./app');
const connectDatabase=require('./config/database')
const dotenv=require('dotenv');

//Handle Uncaugth exceptions
process.on('uncaugthException',err => {
   console.log('Error: ${err.message}');
   console.log('Shutting down server due to uncaugth exception');
   process.exit(1);
})

//Setting up config file

dotenv.config({path :'backend/config/config.env'})


// conntecting to database
connectDatabase();

const server= app.listen(process.env.PORT, () => {
   console.log( `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Unhandled Promise Rejections

process.on('unhandledRejection',err => {
   console.log('Error: ${err.message}');
   console.log('Shutting down the server due to unhandled Promise Rejections');
   server.close(()=> {
      process.exit(1)
   })
})