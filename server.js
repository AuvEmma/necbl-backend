'use strict'
if(process.env.ENVIRONMENT !== 'production'){
  require('dotenv').config();
}
const express             = require('express');
const logger              = require('morgan');
const cors                = require('cors');
const path                = require('path');
const bodyParser          = require('body-parser');
const secret              = process.env.SECRET;
// const expressJWT       = require('express-jwt');
const usersRoutes         = require( path.join(__dirname, '/routes/users'));
const playersRoutes       = require( path.join(__dirname, '/routes/players'));
const seasonsRoutes       = require( path.join(__dirname, '/routes/seasons'));
const regionsRoutes       = require( path.join(__dirname, '/routes/regions'));
const applicationsRoutes  = require( path.join(__dirname, '/routes/applications'));
const gamesRoutes         = require( path.join(__dirname, '/routes/games'));
const filesRoutes         = require( path.join(__dirname, '/routes/files'));

const app                 = express();
const _port               = process.argv[2]|| process.env.PORT||3001;
const corsOptions         = {
  origin: ['http://localhost:3000','http://localhost:4200', 'http://54.158.161.155','https://54.158.161.155', 'http://www.necblcommunity.com/', 'https://www.necblcommunity.com/'],
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

app.use('/users', usersRoutes);
app.use('/players', playersRoutes);
app.use('/seasons', seasonsRoutes);
app.use('/regions', regionsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/games', gamesRoutes);
app.use('/files', filesRoutes);

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
