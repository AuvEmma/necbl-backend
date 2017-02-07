'use strict';
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;
const ObjectId      = require('mongodb').ObjectID;

function createApplication(req, res, next){
  let application    = req.body;
  MongoClient.connect(mongoUrl, function (err, db) {
    let applicationsCollection = db.collection('applications');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating application. ERROR: `, err);
    } else {
      console.log(`Connection established to ${mongoUrl}`);
      console.log(`Adding new application`, application);
      applicationsCollection.insert(application, function(err, result){
        if (err) {
          console.error(error);
        } else {
          console.log('Inserted Application');
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

function allApplications(req, res, next){
  let query = req.query;
  MongoClient.connect(mongoUrl, function (err, db) {
    let applicationsCollection = db.collection('applications');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while getting applications. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      applicationsCollection.find(query).toArray(function(err, result){
        if(err){
          console.error('Error while finding application from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No_Application_Found');
          console.log('No_Application_Found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
}

module.exports.createApplication = createApplication;
module.exports.allApplications = allApplications;
