const mongoose = require('mongoose');

//creating token to reset password
const resetSchema = new mongoose.Schema(
    {
        email:
        {
            type:String,
            required:true,
        },
        //access token to validate link
        access_token:
        {
            type:String,
            required:true,
        },
        is_valid:
        {
            type:Boolean,
            required:true,
        }
    },
    {
        timestamps:true,
    }
);

const resetModel = mongoose.model('ResetPasswordToken',resetSchema);
module.exports = resetModel;