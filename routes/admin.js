const express = require('express');
const adminRoutes = require('../controllers/admin.js');

//now router is a mini app express.
const router = express.Router();

// /admin/add-product
//This route shows the form to add a new product(book).
router.get('/add-product', adminRoutes.getAddProduct);//This is a middleware.

// /admin/add-product.
//This route is in charge of showing all products and the admin is able to edit the product.
router.get('/products', adminRoutes.getProducts);

//It will be only trigger for incoming post requests to add a new product.
// /admin/product => POST
//This handles the incoming data from the form to add a new product.
router.post('/add-product', adminRoutes.postAddProduct);

//To load the form where you can edit a product.
//:productId is a param who comes in the route, inside the controller you need to use body.params.productId
router.get('/edit-product/:productId',adminRoutes.getEditProduct);

//To get the information that the users send when they are editing a product.
router.post('/edit-product',adminRoutes.postEditProduct);

//To delete a product.
router.post('/delete-product', adminRoutes.postDeleteProduct);

//This was the original way to export the object who handles the routes.
//module.exports = router;

//This is another way to export data.
exports.routes = router;













