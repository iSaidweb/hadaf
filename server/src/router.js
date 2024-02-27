module.exports =require('express').Router()
.use('/admin', require('./routers/admin.router'))
.use('/user', require('./routers/user.router'))