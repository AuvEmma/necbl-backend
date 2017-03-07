'use strict'

const express     = require('express');
const applications     = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/applications');

applications.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

applications.route('/')
  .get( db.allApplications )
  .post( db.createApplication )

module.exports = applications;
