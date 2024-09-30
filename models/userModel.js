const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: [true, "please add user name"]
        },
        email:{
            type: String,
            required: [true, "please add contact email address"],
            unique: [true, "Email address already taken"]
        },
        password:{
            type: String,
            required: [true, "please add contact user password"]
        },
    },
    {
        timestamps: true,
    }
); 

module.exports = mongoose.model("User", userSchema);