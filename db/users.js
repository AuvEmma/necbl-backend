'use strict';
const mongodb       = require('mongodb');
const bcrypt        = require('bcrypt');

const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;

const salt          = bcrypt.genSaltSync(10);

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
          password: hash
        };
        console.log(`Adding new user`, newSchool);
        usersCollection.insert(newSchool, function(err, result){
          if (err) {
            console.error(error);
          } else {
            console.log('Inserted');
            console.log('Result:', result);
            console.log('End of Result');
            res.rows = result;
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
  let password        = req.body.password;
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
          if (bcrypt.compareSync(password, data.password_digest)) {
            res.rows = result
          };
          res.status(401).json({data: "password and schoolName do not match"})
        } else {
          res.json('No school found');
          console.log('No school found');
        };
        db.close(function(){
          console.log('db closed');
        });
      });
    };
  });
};

module.exports.login = login;
module.exports.createUser = createUser;
