const { model, Schema } = require('mongoose');
const schema = new Schema({
    name: String,
    phone: {
        type: String,
        default: ''
    },
    access: String,
    telegram: Number,
    role: {
        type: String,
        default: 'user',//user,admin
    },
    step: {
        type: String,
        default: ''
    },
    etc: {
        type: Object,
        default:{}
    }
});
module.exports = model('User', schema);