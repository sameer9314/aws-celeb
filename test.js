var fs=require('fs');

// Load the SDK
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var rekognition = new AWS.Rekognition();

function doSomethingOnceAllAreDone(){
    console.log("Everything is done.");
}

function People(value){
    this.value = value;
}

var peoples = [];
var file=fs.readFileSync('maleImage.json');

let jsonFile = JSON.parse(file);

for(var i=0;i<jsonFile.length;i++){
    peoples.push(new People(jsonFile[i]));
}

console.log(peoples);
var i=0;
People.prototype.someAsyncCall = function(callback){
    setTimeout(function(){
        
        console.log(peoples[i].value.path);
        console.log("Item is done.");
       
        if(typeof callback === "function") callback();
    }, this.imgPath);
};
function compareFaces(targetImage) {
    console.log('--------------In Compare Faces Api-------------- ');

    const bitmap2 = fs.readFileSync('sameer1.jpg');
    const buffer2 = new Buffer.from(bitmap2, 'base64');

    
    const bitmap = fs.readFileSync(targetImage);
    const buffer3 = new Buffer.from(bitmap, 'base64');

    var params = {
        SourceImage: { /* required */
            Bytes: buffer2
        },
        TargetImage: { /* required */
            Bytes: buffer3
        },
        SimilarityThreshold: 0.0
    };
    rekognition.compareFaces(params, function (err, data) {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            console.log('--------------------------End---------------------');
        }           // successful response
    });
}
async = require("async");
 
async.each(peoples,
 
  function(people, callback){
 
    people.someAsyncCall(function (){
      console.log('hi')
      compareFaces(peoples[i].value.path);
      i++;
      callback();
    });
  },

  function(err){
   
    doSomethingOnceAllAreDone();
  }
);

