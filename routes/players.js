'use strict'

const express     = require('express');
const players     = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/players');

players.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

players.route('/')
  .get( db.getPlayers )
  .post( db.createPlayer )

players.route('/:playerId')
  .delete ( db.deletePlayer )

players.route('/all')
  .get( db.allPlayers )

module.exports = players;
