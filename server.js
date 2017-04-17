var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var League = require('./models/leagues.js');
var Team = require('./models/teams.js');

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

// LISTENERS

app.get('/', function(req, res) {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});


/*** SEED DATA ***/
app.get('/seed/newleagues', function(req, res) {

  var teamNames = ["Bulldogs", "Dragons", "Dolphins", "Kings", "Geckos", "Thunderbirds", "Sabercats", "Mammoths", "Lightning", "Rainiers", "Fighting Irish", "Panthers"];

  var newTeams = [];

  for (var i = 0; i < teamNames.length; i++) {
    var wins = Math.floor(Math.random() * 15);
    var losses = Math.floor(Math.random() * (15 - wins));
    var ties = 15 - wins - losses;
    var points = wins * 3 + ties;

    newTeams.push({
      name: teamNames[i],
      wins: wins,
      losses: losses,
      ties: ties,
      points: points
    });
  }

  Team.create(newTeams, function(err, teams) {

    console.log("SEED: NEW Teams CREATED!");

  	var newLeagues = [
  		{
  			name: "Boy's U-12",
  			sport: "Soccer",
  	    teams: teams.slice(0, Math.floor(teams.length / 3))
  		},
  		{
        name: "Girl's U-12",
  			sport: "Soccer",
        teams: teams.slice(Math.ceil(teams.length / 3), Math.floor(teams.length / 3) * 2)
  		},
  		{
        name: "Boy's U-15",
  			sport: "Baseball",
        teams: teams.slice(Math.ceil(teams.length / 3) * 2, teams.length)
  		},
  	];

  	League.create(newLeagues, function(err) {
  		  console.log("SEED: NEW LEAGUES CREATED!");
  		  res.redirect('/');
  	});
  });

});


mongoose.connect('mongodb://localhost:27017/sports');
mongoose.connection.once('open', function() {
  console.log("Connected to mongo");
});

app.listen(3000, function() {
  console.log("Listening...");
});
