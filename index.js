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
  var data = req.body

  if (data.object === 'page') {

   // Iterate over each entry - there may be multiple if batched
   data.entry.forEach(function(entry) {
     var pageID = entry.id;
     var timeOfEvent = entry.time;

     // Iterate over each messaging event
     entry.messaging.forEach(function(event) {
       if (event.message) {
         receivedMessage(event);
       } else {
         console.log("Webhook received unknown event: ", event);
       }
     });
   });


  res.sendStatus(200)
}
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
 var messageText = event.message.text


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
    qs : { access_token: EAAUpjZAlsybcBADZC0iuRvqgFhbXKmw1lEBmWZBjP46jZCbboZAwxg8KN9HY0PWOxgR8btNhrA7Rjc8YZCCvp4q3sGaIZCuqiZCHGerg18In6YnphrfW1kjhbF5nbZAkdUVKbPTcZAi1zxkT3SsuXMSg1JQUxNJi1MeqEPo7nNNUQcz64YiB21loFg},
    method : 'POST',
    json : messageData
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
    var recipientId = body.recipient_id
    var messageId = body.message_id

    console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId)
      }else{
        console.error("Unable to send message.")
     console.error(response)
     console.error(error)
      }

  });

}
app.listen(app.get('port'), function() {
    console.log('Our app is running on http://localhost:');
});
