'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;

function createSeason(req, res, next){
  let seasonName    = req.body.seasonName;
  let regions       = req.body.regions;
  MongoClient.connect(mongoUrl, function (err, db) {
    let seasonsCollection = db.collection('seasons');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating user. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let newSeason = {
        name: seasonName,
        regions: regions
      };
      let query = {
        name: seasonName,
        regions: regions
      }
      let options = {
        upsert: true
      }
      console.log(`Adding new season`, newSeason);
      seasonsCollection.update(query, newSeason, options, function(err, result){
        if (err) {
          console.error(error);
        } else {
          console.log('Inserted');
          console.log('Result:', result.result);
          res.json(result)
        };
        db.close(function(){
          console.log('Close DB');
        });
      });
    };
  });
}

function allSeasons(req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    let seasonsCollection = db.collection('seasons');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while logging in. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      seasonsCollection.find().toArray(function(err, result){
        if(err){
          console.error('Error while finding season name from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No seasons found');
          console.log('No seasons found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
};


module.exports.createSeason   = createSeason;
module.exports.allSeasons     = allSeasons;
