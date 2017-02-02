'use strict'

const express     = require('express');
const users       = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/players');

users.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

users.route('/')
  .get( db.allPlayers )
  .post( db.createPlayer )
