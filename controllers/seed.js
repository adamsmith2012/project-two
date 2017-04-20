var express = require('express');
var router = express.Router();

var League = require('../models/leagues.js');
var Team = require('../models/teams.js');

/*** SEED DATA ***/
router.get('/newleagues', function(req, res) {

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

    var leagueNames = ["Boy's U-12", "Girl's U-12", "Boy's U-14", "Girl's U-14"];

    var sports = ["Soccer", "Basketball", "Baseball"];

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

    // Add teams to league
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

module.exports = router;
