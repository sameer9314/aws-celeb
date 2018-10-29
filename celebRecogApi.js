var express = require('express');
var fs = require("fs");
const fileUpload = require('express-fileupload');

// Load the SDK
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var rekognition = new AWS.Rekognition();

var app = express();

app.get('/firstApi', function (req, res) {
    res.send("My First Node Js Api")
})

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

var bodyParser = require('body-parser');
//var multer  = require('multer');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

var events = require('events');
var eventEmitter = new events.EventEmitter();

var count=1;

app.post('/file_upload', function (req, res) {

    //get uploaded file
    var uploadedFile = req.files.file;

    console.log("uploaded file name  : " + uploadedFile.name);

    var imgPath = uploadedFile.name;


    // listener #1
    var listner1 = function () {
        console.log('In listener 1')
        // To move file to the local storage.
        uploadedFile.mv(imgPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                count=0;
                console.log('Saving image to local database');
                console.log('Image Saved In  : ' + imgPath);
            }

        });
    }

    // listener #2
    var listener2 = function () {

        console.log('In listener 2');

        getCelebrityRecognition('saurav.jpg');
        
    }

    // Bind the storeImage event with the listner1 function
    eventEmitter.on('storeImage', listner1);

    // Bind the getCleb event with the listner2 function
    eventEmitter.on('getCleb',listener2)

    // Fire the storeImage event 
    eventEmitter.emit('storeImage');

    var schedule = require('node-schedule');
 
    var j = schedule.scheduleJob('2 * * * * *', function(){
     // Fire the getCleb event 
    eventEmitter.emit('getCleb');
    });

    
    res.end('End.......');
});


function getCelebrityRecognition(imgName) {
    console.log("img name : "+imgName);
    const bitmap = fs.readFileSync(imgName);
    
    const buffer = new Buffer.from(bitmap, 'base64');
    
    const params = {
        Image: {
            Bytes: buffer
        }
    }

    rekognition.recognizeCelebrities(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})