var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var League = require('./models/leagues.js');
var Team = require('./models/teams.js');

// MIDDLEWARE

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// CONTROLLERS

var leaguesController = require('./controllers/leagues.js');
app.use('/leagues', leaguesController);

// var teamsController = require('./controllers/teams.js');
// app.use('/teams', teamsController);

// LISTENERS

app.get('/', function(req, res) {
  res.render('index.ejs');
});


/*** SEED DATA ***/
app.get('/seed/newleagues', function(req, res) {


  var newTeams = [
    {
      name: "Bulldogs"
    },
    {
      name: "Dragons"
    },
    {
      name: "Dolphins"
    },
    {
      name: "Kings"
    }
  ];

  Team.create(newTeams, function(err, teams) {

    console.log("SEED: NEW Teams CREATED!");

  	var newLeagues = [
  		{
  			name: "Boy's U-12",
  			sport: "Soccer",
  	    teams: [ teams[0], teams[1]]
  		},
  		{
        name: "Girl's U-12",
  			sport: "Soccer",
        teams: [ teams[2] ]
  		},
  		{
        name: "Boy's U-15",
  			sport: "Baseball",
        teams: [ teams[3] ]
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
