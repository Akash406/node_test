'use strict'
var express = require('express')
var bodyparser = require('body-parser')
var request = require('request')

var app = express()

let token = 'EAAUpjZAlsybcBADZC0iuRvqgFhbXKmw1lEBmWZBjP46jZCbboZAwxg8KN9HY0PWOxgR8btNhrA7Rjc8YZCCvp4q3sGaIZCuqiZCHGerg18In6YnphrfW1kjhbF5nbZAkdUVKbPTcZAi1zxkT3SsuXMSg1JQUxNJi1MeqEPo7nNNUQcz64YiB21loFg'

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
  var recipientId = event.recipient.id
  var timeOfMessage = event.timestamp
  var message = event.message

  console.log("Received message for user %d and page %d at %d with message:",
   senderID, recipientId, timeOfMessage);
 console.log(JSON.stringify(message));

 var messageId = message.mid
 var messageText =message.text


 if(messageText){
   switch (messageText) {
     case 'options':
      showOption(senderID)

       break;

       case 'itenary':
       showItenary(senderID)
       break;
     default: sendTextMessage(senderID, messageText)

   }

 }
}

function showItenary(recipientId){
  var messageData = {
    recipient:{
      id: recipientId

    },message:{
      attachment: {
        type : "template",
        payload : {
        template_type: "airline_itinerary",
        intro_message: "Here\'s your flight itinerary.",
        locale: "en_US",
        pnr_number: "ABCDEF",
        passenger_info: [
         {
           name: "Farbound Smith Jr",
           ticket_number: "0741234567890",
           passenger_id: "p001"
         },
         {
           name: "Nick Jones",
           ticket_number: "0741234567891",
           passenger_id: "p002"
         }
       ],
       passenger_info: [
         {
           name: "Farbound Smith Jr",
           ticket_number: "0741234567890",
           passenger_id: "p001"
         },
         {
           name: "Nick Jones",
           ticket_number: "0741234567891",
           passenger_id: "p002"
         }
       ],
       flight_info: [
          {
            connection_id: "c001",
            segment_id: "s001",
            flight_number: "KL9123",
            aircraft_type: "Boeing 737",
            departure_airport: {
              airport_code: "SFO",
              city: "San Francisco",
              terminal: "T4",
              gate: "G8"
            },
            arrival_airport: {
              airport_code: "SLC",
              city: "Salt Lake City",
              terminal: "T4",
              gate: "G8"
            },
            flight_schedule: {
              departure_time: "2016-01-02T19:45",
              arrival_time: "2016-01-02T21:20"
            },
            travel_class: "business"
          },
          {
            connection_id: "c002",
            segment_id: "s002",
            flight_number: "KL321",
            aircraft_type: "Boeing 747-200",
            travel_class: "business",
            departure_airport: {
              airport_code: "SLC",
              city: "Salt Lake City",
              terminal: "T1",
              gate: "G33"
            },
            arrival_airport: {
             airport_code: "AMS",
             city: "Amsterdam",
             terminal: "T1",
             gate: "G33"
           },
           flight_schedule: {
             departure_time: "2016-01-02T22:45",
             arrival_time: "2016-01-03T17:20"
           }
         }
       ],
       passenger_segment_info: [
         {
           segment_id: "s001",
           passenger_id: "p001",
           seat: "12A",
           seat_type: "Business"
         },
         {
           segment_id: "s001",
           passenger_id: "p002",
           seat: "12B",
           seat_type: "Business"
         },
         {
           segment_id: "s002",
           passenger_id: "p001",
           seat: "73A",
           seat_type: "World Business",
           product_info: [
             {
               title: "Lounge",
               value: "Complimentary lounge access"
             },
             {
               title: "Baggage",
               value: "1 extra bag 50lbs"
             }
           ]
         },
         {
           segment_id: "s002",
           passenger_id: "p002",
           seat: "73B",
           seat_type: "World Business",
           product_info: [
             {
               title: "Lounge",
               value: "Complimentary lounge access"
             },
             {
               title: "Baggage",
               value: "1 extra bag 50lbs"
             }
           ]
         }
       ],
       price_info: [
         {
           title: "Fuel surcharge",
           amount: "1597",
           currency: "USD"
         }
       ]
     }

      }


    }

  };
  callSendAPI(messageData)


}

function showOption(recipientId){
  var messageData = {
   recipient: {
     id: recipientId
   },
   message: {
     attachment: {
       type: "template",
       payload: {
         template_type: "generic",
         elements: [{
           title: "rift",
           subtitle: "Next-generation virtual reality",
           item_url: "https://www.oculus.com/en-us/rift/",
           image_url: "http://messengerdemo.parseapp.com/img/rift.png",
           buttons: [{
             type: "web_url",
             url: "https://www.oculus.com/en-us/rift/",
             title: "Open Web URL"
           }, {
             type: "postback",
             title: "Call Postback",
             payload: "Payload for first bubble",
           }],
         }, {
           title: "touch",
           subtitle: "Your Hands, Now in VR",
           item_url: "https://www.oculus.com/en-us/touch/",
           image_url: "http://messengerdemo.parseapp.com/img/touch.png",
           buttons: [{
             type: "web_url",
             url: "https://www.oculus.com/en-us/touch/",
             title: "Open Web URL"
           }, {
             type: "postback",
             title: "Call Postback",
             payload: "Payload for second bubble",
           }]
         }]
       }
     }
   }
 };

 callSendAPI(messageData);

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
    uri : 'https://graph.facebook.com/v2.6/me/thread_settings', //https://graph.facebook.com/v2.6/me/messages
    qs : { access_token: token},
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
