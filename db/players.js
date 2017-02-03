'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;

function createPlayer(req, res, next){
  let playerName    = req.body.playerName;

  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating user. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let newPlayer = {
        name: playerName
      };
      let query = {
        name: playerName
      }
      let options = {
        upsert: true
      }
      console.log(`Adding new user`, newPlayer);
      playersCollection.update(query, newPlayer, options, function(err, result){
        if (err) {
          console.error(error);
        } else {
          console.log('Inserted');
          console.log('Result:', result);
          res.json(result)
        };
        db.close(function(){
          console.log('Close DB');
        });
      });
    };
  });
}
function allPlayers(req, res, next){
  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while logging in. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      playersCollection.find().toArray(function(err, result){
        if(err){
          console.error('Error while finding player name from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No player found');
          console.log('No player found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}
module.exports.createPlayer = createPlayer;
module.exports.allPlayers = allPlayers;
