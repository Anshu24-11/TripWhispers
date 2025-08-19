const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");



const userSchema = new mongoose.Schema({
email: String,
role: {
type: String,
enum: ["user", "admin"],
default: "user"
}
});



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)