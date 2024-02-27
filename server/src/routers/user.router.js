const { Router } = require("express");
const userController = require("../controllers/user.controller");

module.exports = Router()
.get('/get-home', userController.getHome)
.post('/create-order', userController.createOrder)