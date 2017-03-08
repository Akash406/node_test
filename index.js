var express = require('express');
var bodyparser = require('body-parser');
var request = require('request');

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.send('Hi I am chatbot ');
});


//Facebook
app.get('/webhook/', function(req, res)){
  if (req.query['hub.verify_token'] === "test_messengerbot") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }

});


app.listen(app.get('port'), function() {
    console.log('Our app is running on http://localhost:' + port);
});
