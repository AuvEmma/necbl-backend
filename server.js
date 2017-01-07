'use strict'
if(process.env.ENVIRONMENT !== 'production'){
  require('dotenv').config();
}
const express      = require('express');
const logger       = require('morgan');
const cors         = require('cors');
const path         = require('path');
const bodyParser   = require('body-parser');
const secret       = "sweet sweet secret";
const expressJWT   = require('express-jwt');
const mongodb      = require('mongodb');
// const userRoutes   = require( path.join(__dirname, '/routes/users'));

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;

const app          = express();
const _port        = process.argv[2]|| process.env.PORT||3001;

// enable cors and set options
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files
app.use(express.static(path.join(__dirname,'public')));

//set up some logging
app.use(logger('dev'));

// app.use('/users',expressJWT({secret:secret}),userRoutes)

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
