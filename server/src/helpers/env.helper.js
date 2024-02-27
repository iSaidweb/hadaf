process.env.NODE_ENV !== 'production' && require('dotenv').config();
// 
const { APP_PORT,
    MONGO_URI,
    TOKEN,
    ACCESS, } = process.env;
module.exports = {
    APP_PORT,
    MONGO_URI,
    TOKEN,
    ACCESS,
}