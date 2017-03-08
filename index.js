'use strict'
var express = require('express')
var bodyparser = require('body-parser')
var request = require('request')

var app = express()

app.set('port', (process.env.PORT || 8080))

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.send('Hi I am chatbot ')
});


//Facebook
app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token'] === "test_messengerbot") {
    console.log("Validating webhook")
    res.status(200).send(req.query['hub.challenge'])
  } else {
    console.error("Failed validation. Make sure the validation tokens match.")
    res.sendStatus(403)
  }

})

app.post('/webhook/', function(req, res){
  var msg_events = req.body.entry[0].messaging
  for(let i = 0; i<msg_events.length; i++){
    let event = msg_events[i]
    let sender = event.sender.id
    if(event.message){
      receivedMessage(event)
    }else{
      console.log('received unknown event');
    }

  }
  res.sendStatus(200)

})


function receivedMessage(event){
  var senderID = event.sender.id
  var recipientid = event.recipient.id
  var timeoutMessage = event.timestamp
  var message = event.message

  console.log("Received message for user %d and page %d at %d with message:",
   senderID, recipientID, timeOfMessage);
 console.log(JSON.stringify(message));

 var messageId = message.mid
 var messageText = message.text


 if(messageText){
   sendTextMessage(senderID, messageText)
 }
}

function sendTextMessage(recipientId, messageText){
  var messageData = {
   recipient: {
     id: recipientId
   },
   message: {
     text: messageText
   }
 };

 callSendAPI(messageData);
}

function callSendAPI(messageData){
  request({
    uri : 'https://graph.facebook.com/v2.6/me/messages',
    qs : {access_token: EAAUpjZAlsybcBAIKbvCbOhMd5HDO8MKis10hMZCgrS2g1j8eZAJ7WgIxZCbPnPg2zKyNcEBmlHJS5z
C1b6HnrpiBNRs8PwayUoVbx5dfzPe4I45UpPbfV4HX01aFOEDBUpa1jlgFnLBnTHbHigPHXtSMO5FL0dyBQVBOBY4RO4PbtR
3c6Ejq},
method : 'POST',
json : messageData
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
    var recipientId = body.recipient_id;
    var messageId = body.message_id;

    console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
      }else{
        console.error("Unable to send message.");
     console.error(response);
     console.error(error);
      }

  });

}



app.listen(app.get('port'), function() {
    console.log('Our app is running on http://localhost:' + app.get('port'));
});
