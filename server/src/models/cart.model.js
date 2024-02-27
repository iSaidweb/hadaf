const { model, Schema } = require('mongoose');
const schema = new Schema({
    name: String,
    phone: String,
    status: {
        type: String,
        default: 'new'
    }, //new, success, reject, delivered,
    created: Number
});
module.exports = model('Cart', schema);