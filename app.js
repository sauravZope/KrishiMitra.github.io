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



// video2-installing express js;
// npm install --save express ==here we are using it as production dependency, because we want to work on this even on server with express js, 


//video3--requires("express")-- to include the express framework
// express return a function which helper in rqst handling


//video4---what is middleware
// first rqst made==>middleware1==>middleware2==>.....=>send respond
// middleware are series of function/method that execute before sending the respond
// add middleware using app.use() --function --three arg(rqst,res,next); use next to travel 
// from one middleware to anothor ,at last middleware return the response else it dies theree...

// video5--snd function
// we can now send response with res.send("my html,css") and it setHeader automatically


// video6--looking into express
// no need to const server =http.createServer(app) then server.listen(3000);
//express do it my predefine function just write app.listen(port); 
//also send function automaticallly set the content type


// video7--how to handle different route using middleware ordering technique
//what is routing ==https://www.codingninjas.com/codestudio/library/routing-in-node-js
//.use function in express==https://www.geeksforgeeks.org/express-js-app-use-function/
// .use(path,{callback1,callback2,......})---specific that path pr hi middleware has been specifed


//video8---how to access data in form==text only using third party module body-parser
// this module provide property urlencode , using this whole module we can access data snd from form in the particular selected url's listner function using reqst.body


// video9
//difference btw all https method--like get,post,delete,use https://www.w3schools.com/tags/ref_httpmethods.asp
//in the above code selected path listner for "/product" trigger for both get and post that's why converting it to post only so 
// during post reqst it will  excutes..... will during get rqst it will not excute ,this is a another way to filter other than
// filter by path...............


// video10---organising the router files
// in the current sitution all code are in the app.js file which look messsy when project grow big
// so we put all the router code in router folder and in router folder we divide the router file too into admin.js and shop.js ---admin.js contains the routering that related to add,getting stuff
// while shop.js shows the routering which user shows
// how to export and import router file
// step1-- requrires(express) then with express we get property name Router(); save it then use it as a new express file that we will plug in later ,,,,after routing listner ,,,add module.exports=router ,give perssimission to export
// then import it using requires(filename.js)


// video11--handing the error pages
// handing the reqst,res for random url 
// just add last middleware as error 
// and show status-404


// video12
// filtering in routers concept==means what we are want to add the particular bunch of router
// ex==admin/add-product and admin/shop--- here 'admin/' we added
// to kya bar bar likega kya admin/  ,nhi n  to use filtering == usne vo main file h jana external router ko import kiya h or app.use me as a object ki trh pass kiya h ,use a extra argument "admin/" which is the keyword which we want to add,means add ko admin.js wali file k routers me automatically admin/ with url reqst hi jayegi ,or waha admin.js file me bhi .admin nhi likna pdega by default add ho jayga,,,,, 
// imp point ./== relative path,,, /==means absoulte path ,,,careful use tho


// video13 --creating html


//video14--serving/transering the html files
//for transering html files in the routers file we use function res.send("path the html file")
// for getting the path of the file we use a core module requries("path") which provides the function join , and __dirname==gives the  path of current folder(routers folder) ,"../"==for going to one step back means parent of the current folder in order to access the views folders and then goto shop.html using join to add them all
// doublt regarding  "./ vs __dirname"==https://www.geeksforgeeks.org/difference-between-__dirname-and-in-node-js/




// video 15==standard way to get the path of root
// module.exports=path.dirname(process.mainModule.filename);dirname of mainmodule --app.js --filename---then export this module
//then import with some var name ,then use join to goto the whatever dir you want to go...

// video16 external css ko kisse foward/transfer kare
// using the concept of serving files statically 
// statically serving means directly fowarded the file to request without going to server side code and middleware

//working of app.use(express.static(path.join("public")));
//take any rqst that tries to some file ,it automatically fowared to public folder.
//important that in the requested file we already entered the public folder ,soo in this file
// use the path that we already entered public


//----------starting of dynamic content adding--------------
// video1--how to snd more than one function,variable,file from one js to another
// exports.property1=property1,similarly other then in other file first import it then using . operation you can access all property of the given file,,, adminData.router(app.js) and adminData.product(shop.js )

// disadvantage of this type of sharing 
// the data we shared is inherited by node server that's shared access all users ,
// you always want to fetch data for a specific request and if that happens to be the same data you show for all users that send this request,this is fine but sharing this data across requests, across users is typically something you don't want to do because if you now edit this with user A, user B will see the updated version even though you might not want to show that.Maybe it's added that normally it wouldn't have been saved to the database yet,so you don't want to show that to the other users yet,
// maybe it's some personal data.So this is a pattern we can use for now here and it's fine for practicing what we want to practice here but later we'll learn about a technique to share data in memory here, in the node app across different


// vide2--template engine ,usesof its,types
// uses of add dynamic html,css,js file in our server;
// . Templating engines work like this, we got a html-ish template and with that I mean that you typically write some code, some file that contains a lot of html, your html structure and markup, your style and javascript imports, all of that is typically included
// but you have some blanks in there, some placeholders. And then you have your node express content in your app, like our dummy array, our products array we're currently using and you've got a templating engine which understands a certain syntax for which it scans your html-ish template and where it then replaces placeholders or certain snippets depending on the engine you're using with real html content but that content, this html content it uses there is generated on the fly, on the server by the templating engine 
// types==pug,ejs,handlebar


// video3
// installing the pug,ejs and handlerbars
// The app.set() function is used to assign the setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server. app.set("name",'value"),app.get("name");
//some predefined set pair key and values are view engine  and view ,view engine==key tell that for any dynamic rendering use this engine and view tell from where we get the dynamic views
//in  view keyword by default location is maindir/view/.... 
// instead of res.sendFile() we will use res.render(); arg==file name of pug


// video4 --snding dynamic content using pug
// res.render(arg1,arg2)===arg1=filename,arg2=is javascript objects which you can render ex={prd:adminData.product,title:"my shop"}  and in the pug file access by #{just obj name}


// video5==playing with pug syntax ==https://www.sitepoint.com/a-beginners-guide-to-pug/

//video6==adding layout
// As nav bar is common in all the pages of we make a file main-layout.pug ,put the general code their and add keyword block where we want to put extra content and in the remaining file use extends keyword for adding more content


//video last 2===ejss
// ejs is similiar of pug ,no need of extra register ,just use app.set('view engine',ejs)


// -----------------model view control-------------
// its is how we seperate code into different file,how are logical seperate the code into different file and function

// see we have the bunch of code inside the router file,,, their we are returning the logical functionalies like passing the middleware function etc... .now we can split it on the base on the logic that split into product related logic----then into admin-product,users-product==== one way,,, other way==split on the base of prefix url ....


// video1,2==controllers---meant spliting the middleware into different file based on the logic each middleware carrying ==splict middleware into products.js and error.js

// video3=== models--- (see we are creating the product array on the product controller.js,later on we have other data like user data etc,,, now we have to arrange all data logic that's why using model) 


// video 4 and 5---in the video (file==model/product.js) we will see how we permanently store the data in file of the product array ,we use fs -the core module and some JSON property like JSON.parse()==convert array into json file and JSON.stringify()==convert json file into object or array,here we have to pass the listner too hold two arg(err,Filecontent)---err --will implement in case of error occur during getting the file content else we get the filecontent

// JSON. stringify() : This method takes a JavaScript object and then transforms it into a JSON string. JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.

// PROBLEM IN FETCH_ALL FUNCION in this function we actually return all main content which we store in the file or array in case of array it works fine because no function or listner calling is their ,but in case of file system we are actually calling the function fs.read() which take some time to execute(asynchronous function) as js is a synchronous lang so the delay which it take produces the problem that other function


// -----------------optional enhancing-----------------
// make two partition in of views --(shop view and admin view)..
// in shop view we added some file, checkout,cart,product-details etc..
// in admin we added some files like add-product,edit-product etc..
// remember one thing that here we transfer file in admin and shop folder so in the includes folder and controllers/product we have to go one path above using "../" for reaching that file


// video2--- we registered some new routes like cart,checkout etc and add corresponding ejs file to it

// video3 we improve all models/product.js file template add option to put price ,url and description and add it corresponding to the ejs files respectively 

// video4-- work on add to cart button and for  admin --we replace add to cart option to edit and delete and add link to it .Whole idea is from the link we added we add some info about current product then change it in our database



// dynamic routes advance

// video1--- dynamic routes advance
// linking the producting with url so that dencrypt it later then use it for select the particular product
// we pass a one more argument which is product.unqiue id then pass it to (add to cart 's achor tag with the product.unquie Id attach to it )--filename-productList.ejs--- now when hit the details button we have url attach with unquie id--  product(s)/unquieId

// video2---Handing router with unquie id
// use router Like router.get("products/:productId")--like ":" is imp ,,,it is not means like products/:random stuff  ,instead it is just products/random stuff which we can extract with the after given after the name given ":"

// important note :put specific path router first ex: products/delete should be before ,products/:productId else it will never enter the path


// video3---we use a function name params===ex==const prodId=rqst.params.productId;
// to extract key after the keyword ":" in the url/path-----------use this info  to intract with data-product array-

// video4--with the help of key we fetch we used to find the selected product from the database
// in model/product.js---we make static fn findById(id,cb)(asynchronous code)  ---

// video5--we work on file product-details.ejs file ---- we particular product which we founded from key 
// we will render it out from product-details.ejs file and embedded add to cart button in the rendered product

// video6 --we will work on our Cart 
// in the previous videos we passed our data linkded with the url ,but their are some other ways too but have some limitation
// we can pass data in reqst body ,but it only available for Post reqst== means add something ,not for the retreving purpose 
// in the easy words in the <form> tag we put our data and get access in the other file by rqst.body.data_passed ----only available for post reqst
// file-name=shop.js,product-details.ejs

// video7 --adding the model
// we added the file cart in the models, their we simply do three step to make the cart
// 1.we made the class ,without constructor because cart is already present at any intermediate step ,so we added a static function only named as add product their a first check if given product is present or not (in the cart) if exist then increase its quantity ,if not make a new product and then add it to the cart

// video8-query parameter
// we send extra info about our page emmbbed with the url ,by this we can track the user 
// representation: /product/:productId?condition1&condition2
// we are basically using same template for add product and edit product and extra info which are not really required using query parameter ex: (editMode:edit)

// video9: we use of edit in query parameter now using that edit which we pass we differentiate the edit-product.ejs file for add-product or edit-product ,for editing mode on the render the product info on the edit-product.ejs file else we keep it blank


// video10: we linking the edit page 
// see admin product file ,we set href to "edit-product/product.id?edit=true";
// by this on clicking update we redirect to the edit-product page

// video11:edit the product 
// we use model/product.js file here and in this use a trick that if given product already has id then it goes to updating mode else normal adding mode,for this while adding product putting id=null ,else send id

// [[[3-4 video of dynamic rendering note's bna lena]]]



// ------------------------------------------------DataBase------------------------------------
// problems in current data storing technique is we share data accross different data, due to which possiblity of  data inconsistency may araise,data reterving is slow

// sql and no sql are another two ways to do the same task

// vid2---choosing the database
// db provide a easy and fast way to reteving data from the db
// two types of database---sql and no sql
// ex== sql--mySql and no sql --mongodb

// sql --store data in the form of table ,column define attribute of table ,row define a particular order/element and important thing is in sql we can relate one or more table

// Core SQL DB characteristic 
// data schema --all data(in a table) has to fit
// data relation--one to one ,many to one,many to many-----tables are connected


//NO SQL 
// no data schema--- means for a particular element ,it may differ in some extent like having some attritube missing .
// data store in the form of collection ,in collection we find document and each document is a particular data of user/product .. and no strict fixed schema

// we don't make relation instead make the duplicate data and then add more info to it,if data change we have to change in all the collections(tables) ,advantage is no need to join table to retrive the data

// vid3  -SQL VS NO SQL
// scaling-with increase in data in our application ,we also want to scale our data to efficiently run our application 
                      // horizontal scaling vs vertical scaling
    //   add data server and then split and merge data    | existing server ,more strong by adding the more cpu power and memory
                            //    no limition             |   has limitation(cannot have infinite cpu power)
            
// difference-https://academind.com/tutorials/sql-vs-nosql


// video4 --setting up by mysql 
// install mysql package-->create new schema name=node-complete 

// video5 --connecting mySql to our app
// install npm install --save mysql2
// their are two way to create app with db ===>1.createconnection 2.createPool   
// in createconnection only one query occurs then disconnected from db
// in createPool we handle multiple connection ,one query compelete then other query ready to be send ,
// createPool disconnect when  app is down


// video6---testing the database and reterving the dummy data
// db.execute("SELECT * FROM products")
// .then((result)=>{console.log(result[0]);})
// .catch((err)=>{console.log(err);});

// video7---replacing our filesystem code with mysql database code
// do nothing ---just return db.execute(query);
// in the other file just use it by .then  and .catch

// remember while running the sql query of insert some data
// their is concept of sql injection in which user enter some data in your (special)input field to run Sql queries ,,which may harm our database
// for this using special syntax
// return db.execute("INSERT INTO products (title,price,imageUrl,description)  VALUES(?,?,?,?)",[this.title,this.price,this.imageUrl,this.description]); 
// means in values use ? then pass arr as argument




// ---------------------sequelize----------------
// we use sequelize to reduce the tension of writing query
// help us to reduce that query work
// working of sequelize --google se pd lena
// npm install --save sequelize


// video2
// we will replace the raw code we are using to connect our application to our database ,in this we will import sequelize and create its new instance (connection pool ) ans export it
// setting we host and dialect--sql engine
// replace the code 
// const mysql=require("mysql2");

// const pool=mysql.createPool(
//     {
//         host:"localhost",
//         user:"root",
//         database:"node-complete",
//         password:"9827563147",
//     }
// )

// module.exports=pool.promise();


// video 3
// we create a product object intializer in product array and define some attributes in product.js file

// video4
// we will automatically create a table using the sequalize.sync function in app.js file,this will create table and set all the attritube as it is like the 
// define in product.js file also ,it will not overwrite the existing table means if a table already exist do not overrite it

// video5
//  we do some modification in product.js file and use Product.create({js object})---to create and add a new product in our database 
// Product.build only create a javascript obj (not saved in database);

// video6
// product has a function .findAll() to fetch all product from our database

// video7
// find a particular product from database with help of sequalize --\
// approuch1 is; use findByPk----find bu primary key pass on the id of this,this will return a particular obj
// approuch2 is: use findAll()----and inside this use Where keyword to set a condition on a particular atttritube ,this will return array of matched condition ...


// video8
// we are working on file admin.js for updating Product
// we are using Product.findByPk(id)---then update the product instance but this will note change the value in database for this use product.save() 
// here one more imp point is see we are return the (return product.save())---after that handle it by one more then to avoid multiple catches,also the redirect call should in last then() because we have to redirect after the change happen ,as javascript do note wait for anyone 


// video9 --delecting the products
// we can do it using 2 ways
// Product.findByPk(prod)----iss .then me particular product mil jayega phr product.destroy() krr do
// Product.destory({where {id:prodID}})-----directly kr dooo


// video10 --create new model for user 
// add name ,id,email in it ,similar to product.js model which we made earlier in this project

// video11---we are exploring the association means ---  
// A product ------belongs only one user(ADMIN)
//  one user(ADMIN) --has many products

// adding this to our app.js