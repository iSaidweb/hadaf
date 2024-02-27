const { default: axios } = require('axios');
module.exports = function (url) {
    try {
        return axios({ url, responseType: 'stream' })
    } catch (err) {
        console.log(err);
    }
}