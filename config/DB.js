const mongoose = require('mongoose');
const config = require('config');
 let ar =  config.has('mongoURI');
console.log(ar);
// const db = config.get('mongoURI');



 const db= "";

mongoose.connect(db,{
useNewUrlParser : true,
useUnifiedTopology: true,
useCreateIndex:true


});
const connectDB = async()=>{
try {
    
    console.log('MongoDB Connected.....'); 
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
}
module.exports = connectDB;
