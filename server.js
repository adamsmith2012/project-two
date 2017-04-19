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

// LISTENERS

app.get('/', function(req, res) {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});


/*** SEED DATA ***/
app.get('/seed/newleagues', function(req, res) {

  var teamNames = ["Bulldogs", "Dragons", "Dolphins", "Kings", "Geckos",
                   "Thunderbirds", "Sabercats", "Mammoths", "Lightning",
                   "Rainiers", "Fighting Irish", "Panthers", "Donkeys",
                   "Red Devils", "Jets", "Thunder", "Blasters", "Lasers",
                   "Razorbacks", "Sharks", "Cobras", "Steelheads", "Angels",
                   "Gators", "Ants", "Badgers", "Bears", "Bats", "Barracudas",
                   "Bison", "Beavers", "Buffalo", "Cheetahs", "Bees", "Aces",
                   "Coyotes", "Roaches", "Crows", "Ducks", "Elk", "Eagles",
                   "Falcons", "Ferrets", "Foxes", "Gazelles", "Hornets",
                   "Jackels", "Kangaroos", "Jaguars", "Lemurs", "Lions", "Orcas",
                   "Otters", "Penguins", "Rabbits", "Rams", "Ravens", "Scorpions",
                   "Snakes", "Spiders", "Rays", "Tigers", "Wildcats", "Wolves"
                  ];

  var newTeams = [];

  for (var i = 0; i < teamNames.length; i++) {
    var wins = Math.floor(Math.random() * 15);
    var losses = Math.floor(Math.random() * (15 - wins));
    var ties = 15 - wins - losses;
    var points = wins * 3 + ties;

    newTeams.push({
      name: teamNames[i],
      email: teamNames[i] + "@gmail.com",
      wins: wins,
      losses: losses,
      ties: ties,
      points: points
    });
  }

  Team.create(newTeams, function(err, teams) {

    console.log("SEED: NEW Teams CREATED!");

    var leagueNames = ["Boy's U-12", "Girl's U-12", "Boy's U-13", "Girl's U-13", "Boy's U-14", "Girl's U-14"];

    var sports = ["Soccer", "Basketball"];

    var newLeagues = [];

    for (var i = 0; i < leagueNames.length; i++) {
      for (var j = 0; j < sports.length; j++) {

        var sport = sports[j];

        newLeagues.push({
          name: leagueNames[i],
          sport: sport,
          teams: [],
          games: []
        });
      }
    }

    var leagueCount = 0;

    while(teams.length > 0) {
      newLeagues[leagueCount].teams.push(teams.splice(Math.floor(Math.random() * teams.length), 1)[0]);

      leagueCount++;

      if (leagueCount > newLeagues.length - 1) {
        leagueCount = 0;
      }
    }

  	League.create(newLeagues, function(err) {
  		  console.log("SEED: NEW LEAGUES CREATED!");
  		  res.redirect('/');
  	});
  });

});


mongoose.connect(mongoDBURI);
mongoose.connection.once('open', function() {
  console.log("Connected to mongo");
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
