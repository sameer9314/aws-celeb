console.log("------------------------Start Here----------------------------------");

// Load the SDK
var AWS = require('aws-sdk');
var fs= require('fs');
AWS.config.loadFromPath('./config.json');

var rekognition = new AWS.Rekognition();

var params1 = {
    Image: { /* required */
      S3Object: {
        Bucket: 'sameer-sample-bucket',
        Name: 'saurav.jpg'
      }
    }
  };

  var params2 = {
    Image: { /* required */
      S3Object: {
        Bucket: 'sameer-sample-bucket',
        Name:   'scanner_20160902_193207.jpg'
      }
    }
  };

  const bitmap = fs.readFileSync('389530.jpg');
  const buffer = new Buffer.from(bitmap, 'base64')
  
  const params3 = {
    Image: {
      Bytes: buffer
    }
  }
  
  rekognition.recognizeCelebrities(params1, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  rekognition.recognizeCelebrities(params2, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  rekognition.recognizeCelebrities(params3, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
console.log("-------------------Done-----------------------");