const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const session = require('express-session');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
var token;
//const flash = require('connect-flash');
//const validator = require('express-validator');
//const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const jwt = require('jsonwebtoken');

const userRoutes = require('./api/routes/users');
const structureRoutes = require('./api/routes/structures');
const arrondissementRoutes = require('./api/routes/regionvilles');
const villeRoutes = require('./api/routes/villes');
const imagelogoRoutes = require('./api/routes/imageslogo');
const activiteRoutes = require('./api/routes/secteuractivites');
const logopubRoutes = require('./api/routes/logopubs');

/*const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const panierRoutes = require('./api/routes/paniers');
const imageRoutes = require('./api/routes/images');
const smsRoutes = require('./api/routes/sms');

*/
//const checkAuth = require('./api/middleware/check-auth');
//let io = require('socket.io')(http);

let uri = 'mongodb://localhost:27017/trouvite';
mongoose.connect(uri, (err) =>{
    if (err){
        console.log(err);
    }else {
        console.log('connected to MongoDB');
    }
});
/*mongoose.Promise = global.Promise;
require('./config/passport');
*/
app.use(morgan('dev'));

//app.use('/uploadss', express.static('uploadss'));
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(validator())
app.use(cors());
//app.use(express.static('dist'));
app.use('/uploads', express.static('uploads/lena'));
app.use(function(req, res, next){
    token = req.body.token
   
    next();
});

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization');
  if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET,OPTIONS')
      return res.status(202).json({});
  }
  next();
}); 

//Routes which should handle requests
app.use('/structure', structureRoutes);
app.use('/user', userRoutes);
app.use('/arrondissement', arrondissementRoutes);
app.use('/ville', villeRoutes);
app.use('/imageslogo', imagelogoRoutes);
app.use('/secteuractivite', activiteRoutes);
app.use('/logopubs', logopubRoutes);

app.use('*', (req, res) =>{
    res.sendFile(__dirname + '/dist/index.html');
});



app.use((req, res, next) => {
    const error = new Error('Not found ');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
