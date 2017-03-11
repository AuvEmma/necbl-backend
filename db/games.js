'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = process.env.DB_URL;
const ObjectId      = require('mongodb').ObjectID;

function createGame(req, res, next){
  let game    = req.body;
  MongoClient.connect(mongoUrl, function (err, db) {
    let gamesCollection = db.collection('games');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating game. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let newGame = game;
      console.log(`Adding new game`, newGame);
      gamesCollection.insert(newGame, function(err, result){
        if (err) {
          console.error(error);
        } else {
          console.log('Inserted');
          console.log('Result:', result.result);
          res.json(result.result)
        };
        db.close(function(){
          console.log('Close DB');
        });
      });
    };
  });
}

function getGames(req, res, next){
  let query = {};
  if(req.query.schoolid){
    let schoolId = req.query.schoolid;
    query = {
      'schoolIds':  schoolId
    };
  }else if(req.query.gameId){
    query = {
      '_id': ObjectId(req.query.gameId)
    }
  }
  MongoClient.connect(mongoUrl, function (err, db) {
    let gamesCollection = db.collection('games');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting games. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      gamesCollection.find(query).toArray(function(err, result){
        if(err){
          console.error('Error while finding game from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No_Game_Found');
          console.log('No_Game_Found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}

module.exports.getGames = getGames;
module.exports.createGame = createGame;
