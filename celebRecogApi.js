
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

function getCelebrityRecognition(imgName) {
    console.log('--------------In Celebrity Recognition Api-------------- ')
    console.log("img name : " + imgName);
    const bitmap = fs.readFileSync(imgName);

    const buffer = new Buffer.from(bitmap, 'base64');

    const params = {
        Image: {
            Bytes: buffer
        }
    }

    rekognition.recognizeCelebrities(params, function (err, data) {
        if (err) { console.log(err, err.stack); } // an error occurred
        else {
            if (data.CelebrityFaces.length == 0) {
                console.log('---------Celebrity Not Recognized..........');

                //sightEngineApi(imgName);
                detectFaces(imgName);
            }
            else {
                console.log(data); // successful response
                console.log('-----------------------End--------------------------------');
            }
        }
    });
}

// Detect Faces Api
function detectFaces(imgName) {
    console.log('--------------In Detect Faces Api-------------- ')
    const bitmap1 = fs.readFileSync(imgName);
    const buffer1 = new Buffer.from(bitmap1, 'base64');

    var params = {
        Image: { /* required */
            Bytes: buffer1
        },
        Attributes: [
            "ALL"
        ]
    };
    rekognition.detectFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {

            console.log(data.FaceDetails[0].Gender.Value);
            if (data.FaceDetails[0].Gender.Value == 'Male') {
                compareFaces(imgName, 'Male');
            } else {
                compareFaces(imgName, 'Female');
            }
        } // successful response
    });
}
function wait(){
    console.log('---------wait complete');
}
// Compare Faces Api
function compareFaces(sourceImage, gender) {
    console.log('--------------In Compare Faces Api-------------- ');

    const bitmap2 = fs.readFileSync(sourceImage);
    const buffer2 = new Buffer.from(bitmap2, 'base64');

    if (gender == 'Male') var bitmap3 = fs.readFileSync('maleImage.json');
    if (gender == 'Female') var bitmap3 = fs.readFileSync('femaleImage.json');

    let peoples = JSON.parse(bitmap3);

    for (var i = 0; i < peoples.length; i++){
        console.log('"Peoples" : { name :'+ peoples[i].name);
        console.log(peoples[i].path+' }')
    }
    
    for (var i = 0; i < peoples.length; i++) {
        console.log('Loop Count is ' + i);
       
        const bitmap4 = fs.readFileSync(peoples[i].path);
       
        setTimeout(wait,3000); 
       a(buffer2,bitmap4);
       console.log('-------Loop End--------------');
    }
}

function a(buffer2,bitmap4){
    console.log('---------In a------------');
    var buffer3 = new Buffer.from(bitmap4, 'base64');
    setTimeout(wait,3000);
    var params = {
        SourceImage: { /* required */
            Bytes: buffer2
        },
        TargetImage: { /* required */
            Bytes: buffer3
        },
        SimilarityThreshold: 0.0
    };
    console.log('********************************');
    rekognition.compareFaces(params, function (err, data) {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            console.log('--------------------------End---------------------');
        }           // successful response
    });
  
}
//------------Sight Engine Api---------------
function sightEngineApi(imgName) {
    console.log('-------------In Sight Engine----------------');

    var sightengine = require('sightengine')("", "");

    sightengine.check(['celebrities']).set_file(imgName).then(function (result) {
        // read the output (result)
       
        console.log("features   : " + result.faces[0].features);
        console.log("celebrity name : " + result.faces[0].celebrity[0].name);
        console.log("celebrity prob : " + result.faces[0].celebrity[0].prob);
        console.log("celebrity name : " + result.faces[0].celebrity[1].name);
        console.log("celebrity prob : " + result.faces[0].celebrity[1].prob);
        console.log('-----------------------End--------------------------------');
    }).catch(function (err) {
        // handle the error
        console.log(err.stack);
    });

}
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})