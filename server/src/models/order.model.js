const { model, Schema } = require('mongoose');
const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: String,
    phone: String,
    lat: Number,
    long: Number,
    created: Number,
    count: Number,
    status: {
        type: String,
        default: 'new'
    }, //reject, //new, //success, //delivered
});
module.exports = model('Order', schema);