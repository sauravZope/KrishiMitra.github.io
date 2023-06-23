const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  Product.create(
    {
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
      product: product,
    }
  )
    .then((result) => { console.log("Created Product");
       res.redirect("/admin/products")
  })
    .catch((err) => console.log(err));
  ;
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findByPk(prodId).then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })
  }
  ).catch((err) => { console.log(err); });

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId).then((product) => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    return product.save();
  }).then(result =>
  {
    console.log("UPDATED PRODUCT");
    res.redirect('/admin/products');
  }
  ).catch((err) => console.log(err));



};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((err) => { console.log(err); });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findByPk(prodId).then(product=>{
    product.destroy();
    res.redirect("/admin/products");
  }).catch(result=>{console.log(result);})

 
}