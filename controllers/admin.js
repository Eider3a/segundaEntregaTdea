const Product = require('../models/product.js');
//const Cart = require('../models/cart.js');


//This loads the page where you can add a new product
exports.getAddProduct = (req, res, next) => {
    //This was one of the first ways to send a html file, now we are using templating engines.
    //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));

    res.render('./admin/edit-product.ejs', {
        docTitle: 'Form to add a new product',
        editing: false
    });
}

//To receive the data that the users enters in the admin/add-product page.
exports.postAddProduct = (req, res, next) => {
    //console.log(req.body);
    //products.push( { title:req.body.title });//Currently we are using a model.
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    product = new Product(title, imageUrl, description, price);
    product.save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

//To load the form where you can edit the product.
exports.getEditProduct = (req, res, next) => {
    //http://127.0.0.1:3000/admin/edit-product/1?edit=true
    //Where productId=1 and editMode=true they come in the url.
    //We must pass the product data into the view.
    const editMode = req.query.edit;//It's a data who comes embedded into the url.
    //console.log('editMode:' + editMode);

    if (!editMode) {//Besides the productId we also need to pass editMode = true so we can edit the product.
        return res.redirect('/');
    }
    //It comes in the url=> http://127.0.0.1:3000/admin/edit-product/1876

    const productId = req.params.productId;
    //We the last productId we find the product inside the all 
    //products and then we send the data to the view to preload the
    //form where you can edit the product.
    //console.log('productId: ' + productId);

    Product.findById(productId)
        .then(([product, fieldData]) => {
            //product is an array with an object.
            //product[0] is an object with the product information.
            if (product.length > 0) {
                //console.log(product);
                //console.log(product.title);
                res.render('./admin/edit-product.ejs', {
                    docTitle: 'Form to edit an old product',
                    editing: editMode,
                    product: product[0]
                });
            }
            else {
                console.log('There is no a product with that ID');
                res.redirect('/admin/products');
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/products');
        });

}

//We get the data that comes from the edit form and then we update the data using sequelize.
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updateDescription = req.body.description;

    //Updating the product without using sequelize.
    product = new Product(updatedTitle, updatedImageUrl, updateDescription, updatedPrice);
    product.updateProduct(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);

        });

}

//This shows a list of all products where the admin can edit and delete each product.
exports.getProducts = (req, res, next) => {

    //Here we are not using sequelize, just plain queries.
    Product.fetchAll()//This method returns a promise.
        .then(([products, fieldData]) => {//It will return an array with all products.
            //console.log(products);
            res.render('./admin/products.ejs', { prods: products, docTitle: "All the products" });
        }).catch(err => {
            console.log(err);
        });
    /*
    Product.fetchAll(products => {
        res.render('./admin/products.ejs', { prods: products, docTitle: "All the products" });
    });
    */
}

//This will be execute when we hit the delete button inside a product.
exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    const price = req.body.price;

    //Deleting a product without using sequelize.
    Product.deleteProductById(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};
