var async = require("async");
 var fs=require('fs');
var obj = {dev: "/maleImage.json"};
var configs = [];
 
async.forEachOf(obj, (value, key, callback) => {
    fs.readFile(__dirname + value, "utf8", (err, data) => {
        if (err) return callback(err);
        try {
            configs[key] = JSON.parse(data);
            //console.log(configs[key]);
        } catch (e) {
            return callback(e);
        }
        callback();
    });
}, err => {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
    else{
    for(var i=0;i<configs.length;i++){
        console.log(configs[i].path);
        doSomethingWith(configs[i].path);
    }
}
});

function doSomethingWith(path){
    console.log('Hiiii');
    console.log(path);
}
  
  
