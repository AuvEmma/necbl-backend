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
  .get ( db.singlePlayer )
  .delete ( db.deletePlayer )

players.route('/stat')
  .post ( db.addPlayerStat )

module.exports = players;
