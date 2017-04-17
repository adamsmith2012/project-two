var express = require('express');
var router = express.Router();

var Team = require('../models/teams.js');
var League = require('../models/leagues.js');

// INDEX
router.get('/', function(req, res) {
  Team.find({}, function(err, teams) {
    res.render('teams/index.ejs', {
      currentUser: req.session.currentUser,
      teams: teams
    });
  });
});

// NEW
router.get('/new', function(req, res) {
  League.find({}, function(err, foundLeagues) {
    res.render('teams/new.ejs', {
      currentUser: req.session.currentUser,
      leagues: foundLeagues
    });
  });
});

// CREATE
router.post('/', function(req, res) {
  req.body.points = parseInt(req.body.wins) * 3 + parseInt(req.body.ties); // calculate points

  League.findById(req.body.leagueId, function(err, foundLeague) {
    req.body.leaguename = foundLeague.leaguename;
    Team.create(req.body, function(err, createdTeam) {
      foundLeague.teams.push(createdTeam);
      foundLeague.save(function(err, data) {
        res.redirect('/teams');
      });
    });
  });
});

// SHOW
router.get('/:id', function(req, res){
	Team.findById(req.params.id, function(err, team){
		res.render('teams/show.ejs', {
      currentUser: req.session.currentUser,
			team: team
		});
	});
});

// EDIT
router.get('/:id/edit', function(req, res) {
  Team.findById(req.params.id, function(err, team) {
    res.render('teams/edit.ejs', {
      currentUser: req.session.currentUser,
      team: team
    });
  });
});

// PUT
router.put('/:id', function(req, res) {
  req.body.points = parseInt(req.body.wins) * 3 + parseInt(req.body.ties); // calculate points

  Team.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, updatedTeam) {
    League.findOne({ 'teams._id' : req.params.id }, function(err, foundLeague) {
      foundLeague.teams.id(req.params.id).remove();
      foundLeague.teams.push(updatedTeam);
      foundLeague.save(function(err, data) {
        res.redirect('/teams');
      });
    });
  });
});

// DELETE
router.delete('/:id', function(req, res) {
  Team.findByIdAndRemove(req.params.id, function() {
    League.findOne({ 'teams._id' : req.params.id }, function(err, foundLeague) {
      foundLeague.teams.id(req.params.id).remove();
      foundLeague.save(function(err, savedLeague) {
        res.redirect('/teams');
      });
    });
  });
});

module.exports = router;
