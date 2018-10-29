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

                console.log('Saving image to local database');
                console.log('Image Saved In  : ' + imgPath);
            }

        });
    }

    // listener #2
    var listener2 = function () {
        console.log('In listener 2');

        getCelebrityRecognition(uploadedFile.name);
    }

    // Bind the storeImage event with the listner1 function
    eventEmitter.on('storeImage', listner1);

    // Bind the getCleb event with the listner2 function
    eventEmitter.on('getCleb', listener2)

    // Fire the storeImage event 
    eventEmitter.emit('storeImage');

    // Call funtion f after 3 seconds. 
    setTimeout(f, 3000);

    function f() {
        // Fire the getCeleb event
        eventEmitter.emit('getCleb');
    }

    res.end('End.......');
});
//8888888888888888888888888888888888888888888888888888888888888888888

function getCelebrityRecognition(imgName) {
    console.log("img name : " + imgName);
    const bitmap = fs.readFileSync(imgName);

    const buffer = new Buffer.from(bitmap, 'base64');

    const params = {
        Image: {
            Bytes: buffer
        }
    }

    rekognition.recognizeCelebrities(params, function (err, data) {
        console.log('in recog celeb function');
        if (err) { console.log(err, err.stack); } // an error occurred
        else {
            if (data.UnrecognizedFaces[0].Confidence != 0) {
                sightEngineApi(imgName);
            }
            else {
                console.log(data); // successful response
                console.log('-----------------------End--------------------------------');
            }
        }
    });
}

function sightEngineApi(imgName) {
    var sightengine = require('sightengine')("4437087029135", "68VVA7mhbtZ8w7uYVwCU383190");

    sightengine.check(['celebrities']).set_file(imgName).then(function (result) {
        // read the output (result)
        console.log(result);
        console.log("features   : " + result.faces[0].features);
        console.log("celebrity name : " + result.faces[0].celebrity[0].name);
        console.log("celebrity prob : " + result.faces[0].celebrity[0].prob);
        console.log("celebrity name : " + result.faces[0].celebrity[1].name);
        console.log("celebrity prob : " + result.faces[0].celebrity[1].prob);
        console.log('-----------------------End--------------------------------');
    }).catch(function (err) {
        // handle the error
        console.log(err, err.stack);
    });
}
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})