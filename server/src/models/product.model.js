const { model, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    price: Number,
    about: String,
    images: Array,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    active: {
        type: Boolean,
        default: true
    },
});
module.exports = model('Product', schema);