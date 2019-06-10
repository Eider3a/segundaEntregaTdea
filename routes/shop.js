const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.js');

//With get the url must match.
//With get the path needs to be exact.
router.get('/',shopController.getIndex);//It must change, now is a starting page.

//To load the view with all products.
router.get('/products', shopController.getProducts);

//To see the details of an especific product.
//:productId is a param.
router.get('/products/:productId', shopController.getProductDetails)

/*
//To load the view with the carts.
router.get('/cart', shopController.getCart);

//To add a new product into the cart.
router.post('/cart', shopController.postCart);

router.post('/delete_item_cart',shopController.postDeleteItemCart);
*/

//To see the orders(at the moment is not working).
router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
