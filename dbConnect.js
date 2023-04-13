let mongoose  = require('mongoose');
let url = "mongodb://127.0.0.1:27017/contact";



let dbConnect = async()=>{
   await mongoose.connect(url);
}

module.exports = dbConnect;







