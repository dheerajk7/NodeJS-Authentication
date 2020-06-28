const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email:
        {
            type:String,
            required:true,
        },
        name:
        {
            type:String,
            required:true,
        },
        password:
        {
            type:String,
            required:true,
        },
        //to keep track whether user has verified mail or not 
        is_varified:
        {
            type:Boolean,
            required:true,
        },
        // to keep track that user have created password till or not in case of google login no password is created and its false
        is_password_available:
        {
            type:Boolean,
            required:true,
        }
    },
    {
        timestamps:true,
    }
);

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;