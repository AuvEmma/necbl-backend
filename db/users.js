'use strict';
const mongodb       = require('mongodb');
const bcrypt        = require('bcrypt');
const secret        = process.env.SECRET;

const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;

const salt          = bcrypt.genSaltSync(10);
const jwt         = require('jsonwebtoken');

function createSecure(schoolName, password, callback) {
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash){
      callback(schoolName, hash)
    });
  });
};

function createUser(req, res, next) {
  createSecure(req.body.schoolName, req.body.passcode, saveUser);
  function saveUser(schoolName, hash) {
    MongoClient.connect(mongoUrl, function (err, db) {
      let usersCollection = db.collection('users');
      if (err) {
        console.error(`Unable to connect to the mongoDB server ${mongoUrl} while creating user. ERROR: `, err);
      } else {
        console.log(`Connection established to ${mongoUrl}`);
        let newSchool = {
          name: schoolName,
          password: hash,
          canChangePassword: true
        };
        let query = {
          name: schoolName
        }
        let options = {
          upsert: true
        }
        console.log(`Adding new user`, newSchool);
        usersCollection.update(query, newSchool, options, function(err, result){
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
  };
}

function login(req, res, next) {
  let schoolName      = req.body.schoolName;
  let passcode        = req.body.passcode;
  MongoClient.connect(mongoUrl, function (err, db) {
    let usersCollection = db.collection('users');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while logging in. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      let school = {name: schoolName};
      usersCollection.find(school).toArray(function(err, result){
        if(err){
          console.error('Error while finding school name from db', err);
        } else if (result.length) {
          console.log('found:', result);
          if (bcrypt.compareSync(passcode, result[0].password)) {
            var token = jwt.sign(schoolName, secret);
            res.json({id: result[0]._id, name: result[0].name, token: token, canChangePassword: result[0].canChangePassword});
          }else{
            res.status(401).json({data: "password and schoolName do not match"})
          }
        } else {
          res.json('No_School_Found');
          console.log('No school found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
};

function allUsers(req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    let usersCollection = db.collection('users');
    if (err) {
      console.error(`Unable to connect to the mongoDB server ${mongoUrl} while logging in. ERROR: `, err);
    } else{
      console.log(`Connection established to ${mongoUrl}`);
      usersCollection.find().toArray(function(err, result){
        if(err){
          console.error('Error while finding school name from db', err);
        } else if (result.length) {
          console.log(result)
          res.json(result);
        } else {
          res.json('No_School_Found');
          console.log('No school found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
};

function checkToken(req, res, next){
  let token = req.body.token;
  if(token){
    let decoded = jwt.decode(token, secret);
    MongoClient.connect(mongoUrl, function (err, db) {
      let usersCollection = db.collection('users');
      usersCollection.find({name: decoded}).toArray(function(err, result){
        if(err){
          console.error('Error while finding school name from db', err);
        } else if (result.length) {
          console.log('results in checkToken',result);
          res.json(result);
        } else {
          res.json('No_School_Found');
        };
        db.close(()=>console.log('db closed'))
      });
    });
  };
};
module.exports.login      = login;
module.exports.createUser = createUser;
module.exports.allUsers   = allUsers;
module.exports.checkToken = checkToken;
