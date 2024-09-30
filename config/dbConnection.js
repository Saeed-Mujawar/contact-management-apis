const mongoose = require("mongoose");

const connectDb = async () =>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Host: ", connect.connection.host);
        console.log("DB Name: ", connect.connection.name);
    }catch(err){
        process.exit(1);
    }
};

module.exports = connectDb;