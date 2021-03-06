'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = process.env.DB_URL;
const ObjectId      = require('mongodb').ObjectID;

function createPlayer(req, res, next){
  let player    = req.body;
  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating player. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let newPlayer = player;
      console.log(`Adding new user`, newPlayer);
      playersCollection.insert(newPlayer, function(err, result){
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

function getPlayers(req, res, next){
  if(req.query.school && req.query.season){
    let schoolName = req.query.school;
    let seasonId = req.query.season;
    let query = {
      'schoolhistory.name':  schoolName,
      'seasonshistory.id':  seasonId
    };
    console.log(query)
    MongoClient.connect(mongoUrl, function (err, db) {
      let playersCollection = db.collection('players');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting players. ERROR: `, err);
      } else{
        console.log(`Connection established to ${mongoUrl}`);
        console.log('========>',query)
        playersCollection.find(query).toArray(function(err, result){
          if(err){
            console.error('Error while finding player name from db', err);
          } else if (result.length) {
            console.log(result)
            res.json(result);
          } else {
            res.json('No_Player_Found');
            console.log('No_Player_Found');
          };
          db.close(function(){
            console.log('db closed');
          });
        });
      };
    });
  }else if(req.query.school && !req.query.season){
    let schoolId = req.query.school;
    let query = {
      'schoolhistory.id':  schoolId
    };
    MongoClient.connect(mongoUrl, function (err, db) {
      let playersCollection = db.collection('players');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting players. ERROR: `, err);
      } else{
        console.log(`Connection established to ${mongoUrl}`);
        console.log('========>',query)
        playersCollection.find(query).toArray(function(err, result){
          if(err){
            console.error('Error while finding player name from db', err);
          } else if (result.length) {
            console.log(result)
            res.json(result);
          } else {
            res.json('No_Player_Found');
            console.log('No_Player_Found');
          };
          db.close(function(){
            console.log('db closed');
          });
        });
      };
    });
  }else if(req.query.playerid){
    let playerid = req.query.playerid;
    let query = {
      '_id': ObjectId(playerid)
    };
    MongoClient.connect(mongoUrl, function (err, db) {
      let playersCollection = db.collection('players');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting players. ERROR: `, err);
      } else{
        console.log(`Connection established to ${mongoUrl}`);
        console.log('========>',query)
        playersCollection.find(query).toArray(function(err, result){
          if(err){
            console.error('Error while finding player name from db', err);
          } else if (result.length) {
            console.log(result)
            res.json(result);
          } else {
            res.json('No_Player_Found');
            console.log('No_Player_Found');
          };
          db.close(function(){
            console.log('db closed');
          });
        });
      };
    });
  }else{
    MongoClient.connect(mongoUrl, function (err, db) {
      let playersCollection = db.collection('players');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting players. ERROR: `, err);
      } else{
        console.log(`Connection established to ${mongoUrl}`);
        playersCollection.find().toArray(function(err, result){
          if(err){
            console.error('Error while finding player name from db', err);
          } else if (result.length) {
            console.log(result)
            res.json(result);
          } else {
            res.json('No_Player_Found');
            console.log('No_Player_Found');
          };
          db.close(function(){
            console.log('db closed');
          });
        });
      };
    });
  }

}

function getPlayerForGame(req, res, next){
    let schoolId = req.query.school;
    let query = {
      'schoolhistory.id':  schoolId
    };
    MongoClient.connect(mongoUrl, function (err, db) {
      let playersCollection = db.collection('players');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting players. ERROR: `, err);
      } else{
        console.log(`Connection established to ${mongoUrl}`);
        console.log('========>',query)
        playersCollection.find(query).toArray(function(err, result){
          if(err){
            console.error('Error while finding player name from db', err);
          } else if (result.length) {
            console.log(result)
            res.json(result);
          } else {
            res.json('No_Player_Found');
            console.log('No_Player_Found');
          };
          db.close(function(){
            console.log('db closed');
          });
        });
      };
    });
}

function deletePlayer(req, res, next){
  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while deleting player. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      let playerId = req.params.playerId;
      let query = {
        _id: ObjectId(playerId)
      };
      playersCollection.remove(query, function(err, result){
        if(err){
          console.error(`Error while deleteing player ${playerId} from db`, err);
        } else{
          console.log('Deleted',result)
          res.json(result);
        }
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}

function singlePlayer(req, res, next){
  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while deleting player. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      let schoolId = req.params.schoolId;
      let query = {
        _id: ObjectId(playerId)
      };
      playersCollection.remove(query, function(err, result){
        if(err){
          console.error(`Error while deleteing player ${playerId} from db`, err);
        } else{
          console.log('Deleted',result)
          res.json(result);
        }
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}

function addPlayerStat(req, res, next){
  let player = req.body.stat.player;
  let game = req.body.stat.game;
  let stat = req.body.stat;
  delete stat.player;
  delete stat.game.homeplayers;
  delete stat.game.awayplayers;
  MongoClient.connect(mongoUrl, function (err, db) {
    let playersCollection = db.collection('players');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while deleting player. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      let query = {
        _id: ObjectId(player._id)
      };
      let update = {
        $push:{
          "gameshistory":stat
        }
      };
      playersCollection.update(query, update, function(err, result){
        if(err){
          console.error(`Error while adding stat to player ${player._id} from db`, err);
        } else{
          console.log('added stat',result)
          res.json(result);
        }
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}

module.exports.createPlayer = createPlayer;
module.exports.deletePlayer = deletePlayer;
module.exports.getPlayers = getPlayers;
module.exports.singlePlayer = singlePlayer;
module.exports.addPlayerStat = addPlayerStat;
