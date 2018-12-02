const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    avatar: {
        type: String,
    }

})

const User = mongoose.model('users', UserSchema);
module.exports = User;