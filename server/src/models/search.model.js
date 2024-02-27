const { model, Schema } = require('mongoose');
const schema = new Schema({
    name: String,
    phone: String,
    lat: Number,
    long: Number,
    created: Number,
    count: Number,
    image: String,
    status: {
        type: String,
        default: 'new'
    }, //reject, //new, //success, //delivered
});
module.exports = model('Search', schema);