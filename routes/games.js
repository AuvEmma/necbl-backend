'use strict'

const express     = require('express');
const games       = express.Router();
const bodyParser  = require('body-parser');
const db          = require('./../db/games');

games.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

games.route('/')
  .get( db.getGames )
  .post( db.createGame )

games.route('/stat')
  .post( db.addStatToGame )

games.route('/stat/score')
.post( db.addScoreToGame )

// players.route('/:playerId')
//   .get ( db.singlePlayer )
//   .delete ( db.deletePlayer )

module.exports = games;
