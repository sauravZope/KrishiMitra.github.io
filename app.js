const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

const sequalize=require("../my_updated_code/util/database");
const Product=require("./models/product");
const User=require("./models/user");

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const { FORCE } = require('sequelize/types/index-hints');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints: true, onDelete: "CASCADE"});
// User.hasMany(Product);
User.hasMany(Product);

sequalize.sync( ).then(
    (result)=>
    {
        // console.log(result);
        app.listen(3000);
    }
    
    ).catch(
        (err)=>{
        console.log(err);}
          );



