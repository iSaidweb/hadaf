const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: String,
    phone: Number,
    role: {
        type: String,
        default: "admin"//creator, admin
    },
    password: String,
    access: String
});
module.exports = model('Admin', schema);