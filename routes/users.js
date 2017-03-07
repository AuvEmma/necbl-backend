'use strict'

const express     = require('express');
const users       = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/users');
const secret      = process.env.SECRET;
const expressJWT  = require('express-jwt');
const jwt         = require('jsonwebtoken');

users.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

users.route('/')
  .get( db.allUsers )
  .post( db.createUser )
  // Create a new user

users.route('/login')
  .post( db.login )

users.route('/check')
  .post( db.checkToken )


module.exports = users;
