const express = require('express');
const cors = require('cors');
const filer = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');
const { MONGO_URI, APP_PORT } = require('./src/helpers/env.helper');
const bot = require('./src/bot/bot');
const { defaultAdmin } = require('./src/controllers/admin.controller');
const router = require('./src/router');
mongoose.connect(MONGO_URI)
app.use(express.json());
app.use(filer());
app.use(cors());
defaultAdmin();
app.use('/uploads', express.static('uploads'));
app.use('/api', router)
app.listen(APP_PORT,()=>{
    bot.launch();
})