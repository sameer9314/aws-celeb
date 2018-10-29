// app.get('/process_get', function (req, res) {
//   // Prepare output in JSON format
//   response = {
//      first_name:req.query.first_name,
//      last_name:req.query.last_name
//   };
//   console.log(response);
//   res.end(JSON.stringify(response));
// })

// var events = require('events');
// var eventEmitter = new events.EventEmitter();

// // listener #1
// var listner1 = function listner1() {
//    console.log('listner1 executed.');
// }

// // listener #2
// var listner2 = function listner2() {
//    console.log('listner2 executed.');
// }

// // Bind the connection event with the listner1 function
// eventEmitter.addListener('connection', listner1);

// // Bind the connection event with the listner2 function
// eventEmitter.on('connection', listner2);

// var eventListeners = require('events').EventEmitter.listenerCount
//    (eventEmitter,'connection');
// console.log(eventListeners + " Listner(s) listening to connection event");

// // Fire the connection event 
// eventEmitter.emit('connection');

// // Remove the binding of listner1 function
// eventEmitter.removeListener('connection', listner1);
// console.log("Listner1 will not listen now.");

// // Fire the connection event 
// eventEmitter.emit('connection');

// eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
// console.log(eventListeners + " Listner(s) listening to connection event");

// console.log("Program Ended.");

// var schedule = require('node-schedule');
 
// var j = schedule.scheduleJob('42 * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });

// Sceduler
// var schedule = require('node-schedule');
// var j = schedule.scheduleJob('1 * * * * *', function(){
//     console.log('In scheduler');

//      // Fire the getCleb event 
//     eventEmitter.emit('getCleb');
//     j.cancel();
//     });


// else {
//     if (data.UnrecognizedFaces[0].Confidence != 0 && count < 2) {
//         console.log(count);
//         count++;
//         rekognition.recognizeCelebrities(params, function (err, data) {
//             console.log('Unrecognized Image, Calling Function Again');
//             recog();
//         });
//     } 