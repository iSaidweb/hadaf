const adminController = require('../controllers/admin.controller');
const { admin } = require('../helpers/auth.helper');

module.exports = require('express').Router()
    .post('/sign-in', adminController.signIn)
    .get('/verify-auth', admin, adminController.verifyAuth)
    // CATEGORY
    .get('/get-all-categories', admin, adminController.getAllCategories)
    .post('/create-category', admin, adminController.createCategory)
    .post('/edit-category', admin, adminController.editCategory)
    .post('/delete-category', admin, adminController.deleteCategory)
    // PRODUCTS
    .get('/get-all-products', admin, adminController.getAllProducts)
    .post('/create-product', admin, adminController.createProduct)
    .post('/edit-product', admin, adminController.editProduct)
    .post('/delete-product', admin, adminController.deleteProduct)
    // ORDERS
    .get('/get-new-orders', admin, adminController.getNewOrders)