var express = require('express');
var bodyparser = require('body-parser');
var request = require('request');

var app = express();

var port = process.env.PORT || 8080;
app.set('port', port);

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.set('Hi I am chatbot ');
});

app.get('/webhook/', function(req, res)){
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "test_messengerbot") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }

});


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
