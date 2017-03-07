'use strict'

const express     = require('express');
const regions     = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/regions');

regions.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

regions.route('/')
  .get( db.allRegions )
  .post( db.createRegion )

regions.route('/:regionId')
  .delete( db.deleteRegion )

module.exports = regions;
