var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var League = require('./models/leagues.js');
var Team = require('./models/teams.js');
var Game = require('./models/games.js');

var port = process.env.PORT || 3000;
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sports'

// MIDDLEWARE

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: "kungfukenny",
  resave: false,
  saveUninitialized: false
}));

// CONTROLLERS

var usersController = require('./controllers/users.js');
app.use('/users', usersController);

var sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);

var leaguesController = require('./controllers/leagues.js');
app.use('/leagues', leaguesController);

var teamsController = require('./controllers/teams.js');
app.use('/teams', teamsController);

var gamesController = require('./controllers/games.js');
app.use('/games', gamesController);

var seedController = require('./controllers/seed.js');
app.use('/seed', seedController);

// LISTENERS

app.get('/', function(req, res) {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});

mongoose.connect(mongoDBURI);
mongoose.connection.once('open', function() {
  console.log("Connected to mongo");
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
