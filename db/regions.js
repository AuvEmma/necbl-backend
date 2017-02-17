'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = process.env.DB_URL;
const ObjectId      = require('mongodb').ObjectID;

function createRegion(req, res, next){
  let regionName    = req.body.regionName;

  MongoClient.connect(mongoUrl, function (err, db) {
    let regionsCollection = db.collection('regions');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating region. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let newRegion = {
        name: regionName
      };
      let query = {
        name: regionName
      }
      let options = {
        upsert: true
      }
      console.log(`Adding new region`, newRegion);
      regionsCollection.update(query, newRegion, options, function(err, result){
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

function deleteRegion(req, res, next){
  let regionId    = req.params.regionId;
  MongoClient.connect(mongoUrl, function (err, db) {
    let regionsCollection = db.collection('regions');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while deleting region. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      let query = {
        _id: ObjectId(regionId)
      }
      console.log(`Deleting region`, query);
      regionsCollection.remove(query, function(err, result){
        if (err) {
          console.error(error);
        } else {
          console.log('Deleted');
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


function allRegions(req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    let regionsCollection = db.collection('regions');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting all regions. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      regionsCollection.find().toArray(function(err, result){
        if(err){
          console.error('Error while finding school name from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No regions found');
          console.log('No regions found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
};


module.exports.createRegion    = createRegion;
module.exports.allRegions      = allRegions;
module.exports.deleteRegion    = deleteRegion;
