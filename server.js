'use strict'
if(process.env.ENVIRONMENT !== 'production'){
  require('dotenv').config();
}
const express      = require('express');
const logger       = require('morgan');
const cors         = require('cors');
const path         = require('path');
const bodyParser   = require('body-parser');
const secret       = process.env.SECRET;
// const expressJWT   = require('express-jwt');
const userRoutes   = require( path.join(__dirname, '/routes/users'));

const app          = express();
const _port        = process.argv[2]|| process.env.PORT||3001;
const corsOptions  = {
  origin: ['http://localhost:3000','http://localhost:4200'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
// enable cors and set options
app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files
app.use(express.static(path.join(__dirname,'public')));

//set up some logging
app.use(logger('dev'));

app.use('/users', userRoutes);

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/index.html'));
})

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/index.html'));
})
// turn me on!
app.listen(_port , ()=>
  console.log(`server here! listening on`, _port )
);
