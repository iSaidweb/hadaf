const { model, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    active: {
        type: Boolean,
        default: true
    },
});
module.exports = model('Category', schema);