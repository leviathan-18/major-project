const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongoose);

// Step 3: Create the model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;