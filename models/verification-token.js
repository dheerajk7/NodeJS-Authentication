const mongoose = require('mongoose');

//creating verification to validate verification link
const verificationSchema = new mongoose.Schema(
    {
        user:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        access_token:
        {
            type:String,
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

const verificationModel = mongoose.model('VerificationToken',verificationSchema);
module.exports = verificationModel;