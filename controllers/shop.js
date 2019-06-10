
//Variable to store the data that the user enters.
//const products = [];//Currently we are using a model.
const Product = require('../models/product.js');
//const Cart = require('../models/cart.js');


//This loads the starting page(index.ejs).
exports.getIndex = (req, res, next) => {

    //Fetching all the products from the database.
    Product.fetchAll()//It returns an array with all products.
        .then(([rows, fieldData]) => {
            res.render('./shop/index.ejs', { prods: rows, docTitle: 'Eiders shop' });
        })
        .catch(err => {
            console.log(err);

        });

    //Both get() and catch() methods receive and anonymous function.
    //This was the way to get all products from the db whithout an ORM.
    /*
    Product.fetchAll()
        .then(([rows, dataFields]) => {
            res.render('./shop/index.ejs', { prods: rows, docTitle: 'Eiders shop' });
            //dataFields contains some information about the table where we get the data.
        })
        .catch(err => console.log(err));
    */

}

//This controller loads the page with all products.
exports.getProducts = (req, res, next) => {

    //Retrieving all the products from the DB.
    Product.fetchAll()
        .then(([rows, fieldData]) => {//The param could be [rows, fieldData] but I'm not using fieldData.
            res.render('./shop/product-list.ejs', { prods: rows, docTitle: 'All products' });
        })
        .catch(err => {
            console.log(err)
        });
    /*
    Product.fetchAll()
        .then(([rows, dataFields]) => {
            res.render('./shop/product-list.ejs', { prods: rows, docTitle: 'All products' });
        })
        .catch(err => console.log(err));
    */
}

//This controller loads the details of a product.
exports.getProductDetails = (req, res, next) => {
    //params is a property of the body and productId is the data we passed(both names have to match)
    const productId = req.params.productId;

    Product.findById(productId)
        .then(([product, fieldData]) => {
            res.render('./shop/product-detail.ejs', { product: product[0], docTitle: product[0].title });
        })
        .catch(err => {
            console.log(err);

        });

    /*
    Product.getProductById(productId)
        .then(([row, dataFields]) => {
            //console.log(row);
            res.render('./shop/product-detail.ejs', { product: row[0], docTitle: 'Product Details>' });
        })
        .catch(err => console.log(err));
    */
}

//This controller loads the page with the all orders.
exports.getOrders = (req, res, next) => {
    res.render('./shop/orders.ejs', { docTitle: "This is the orders page" });
}

//This controller loads the page with the products added to buy(cart page)
/*
exports.getCart = (req, res, next) => {
    Cart.getWholeCart(cart => {
        const cartItems = [];//This will be the data that we are going to return with the view.
        Product.fetchAll(products => {
            if (products) {
                if (cart.products) {
                    for (cartItem of cart.products) {//Looping throught the whole cart.
                        const product = products.find(product => product.id === cartItem.id);
                        if (product) {
                            cartItems.push({ product: product, qty: cartItem.qty });
                        }
                    }
                }


            }

            res.render('./shop/cart.ejs', { cartItems: cartItems, docTitle: "This is your cart list" });

        });


    });

}

//This controller add an item into the cart.
exports.postCart = (req, res, next) => {
    const productId = req.body.productID;
    console.log(productId);
    Product.getProductById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
}

//This controller allows us to delete a product inside the cart.
exports.postDeleteItemCart = (req, res, next) => {
    const itemId = req.body.itemId;
    Product.getProductById(itemId, product => {
        Cart.deleteProduct(itemId, product.price);
        res.redirect('/cart');
    });

}

*/

//This controller loads the checkout who is kind of like a place where you can see some products.
exports.getCheckout = (req, res, next) => {
    res.render('./shop/checkout.ejs', { docTitle: "This is the checkout" });
}




