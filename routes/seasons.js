'use strict'

const express     = require('express');
const seasons     = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/seasons');

seasons.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

seasons.route('/')
  .get( db.allSeasons )
  .post( db.createSeason )

module.exports = seasons;
