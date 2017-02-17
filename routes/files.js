'use strict'

const express      = require('express');
const files        = express.Router();
// const bodyParser   = require('body-parser');
// const fs           = require('fs');
// const google       = require('googleapis');
// const OAuth2       = google.auth.OAuth2;
const multer       = require('multer');
const mongodb       = require('mongodb');
const MongoClient   = mongodb.MongoClient;
const mongoUrl      = 'mongodb://' + process.env.DB_URL + '/' + process.env.DB_NAME;
const ObjectId      = require('mongodb').ObjectID;

// const upload       = multer({dest: 'images/'});
// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URL
// );
//
// const drive        = google.drive({ version: 'v3', auth: oauth2Client });
//
// oauth2Client.setCredentials({
//   access_token: 'sdakfjlkejwrqioufasdf'
// });

// files.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "http://localhost:4200");
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//         next();
// });
files.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

// files.use(function(error, request, response, next) {
//   if(error.name === 'UnauthorizredError') {
//     response.status(401).json({message: 'you need an authoriation token to view condifential information'});
//   }
// });


// files.post('/', upload.single('file'), function(req, res, next){
//   console.log(req.file)
// })
let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

let upload = multer({ //multer settings
                    storage: storage
                }).single('file');


files.post('/', function(req, res) {
        upload(req,res,function(err){
            console.log('Uploaded file',req.file);
            let file = {
              name: req.file.filename,
              dest: req.file.destination,
              path: req.file.path
            }
            res.json(file)
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
        });
    });

// files.post('/', function(req, res){
//   drive.files.create({
//     resource: {
//       title: 'Test',
//       mimeType: 'text/plain'
//     },
//   }, function (err, response) {
//   console.log('error:', err, 'updated:', response);
//   });
// })
//
// function upload(request, response){
//
// }



//
// // Load client secrets from a local file.
// fs.readFile('client_secret.json', function processClientSecrets(err, content) {
//   if (err) {
//     console.log('Error loading client secret file: ' + err);
//     return;
//   }
//   // Authorize a client with the loaded credentials, then call the
//   // Drive API.
//   authorize(JSON.parse(content), listFiles);
// });
//
// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  *
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   var clientSecret = credentials.installed.client_secret;
//   var clientId = credentials.installed.client_id;
//   var redirectUrl = credentials.installed.redirect_uris[0];
//   var auth = new googleAuth();
//   var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//
//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, function(err, token) {
//     if (err) {
//       getNewToken(oauth2Client, callback);
//     } else {
//       oauth2Client.credentials = JSON.parse(token);
//       callback(oauth2Client);
//     }
//   });
// }

module.exports = files;
