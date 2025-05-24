const path = require('path'); // Provides utilities to work with file and directory paths.
const express = require('express'); // Imports the Express framework to simplify server setup and routing.
const bodyParser = require('body-parser'); // Parses incoming request bodies, allowing access to form data.
const mongoose = require('mongoose'); // Connects to and manages MongoDB databases using an object data modeling (ODM) library.
const session = require('express-session'); // Manages user sessions, tracking data across requests.
const MongoDBStore = require('connect-mongodb-session')(session); // Stores sessions in MongoDB for persistence.
const flash = require('connect-flash'); // Provides a way to display temporary messages (e.g., success or error messages) to users.


const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI='mongodb+srv://root:root@cluster0.bmv5rc8.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const govSchemeRoutes=require("./routes/govSchemeRoutes")
const authRoutes = require('./routes/auth');
const GeminiApiCallRoute=require("./routes/GeminiApiCallRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  
// creating the local var , sync with req.session 's isloggedIn.
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(govSchemeRoutes);
app.use(GeminiApiCallRoute);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
