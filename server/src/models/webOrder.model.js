const { model, Schema } = require('mongoose');
const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: String,
    phone: String,
    count: Number,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    status: {
        type: String,
        default: 'new'
    }, //reject, //new, //success, //delivered
});
module.exports = model('WebOrder', schema);