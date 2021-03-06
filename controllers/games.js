var express = require('express');
var router = express.Router();

var Game = require('../models/games.js');
var League = require('../models/leagues.js');
var Team = require('../models/teams.js');

// INDEX
router.get('/', function(req, res) {
  Game.find({}, function(err, games) {
    res.render('games/index.ejs', {
      currentUser: req.session.currentUser,
      games: games
    });
  });
});

// NEW
router.get('/new/:leagueId', function(req, res) {
  if(req.session.currentUser) {
    League.findById(req.params.leagueId, function(err, foundLeague) {
      console.log(foundLeague);
      res.render('games/new.ejs', {
        currentUser: req.session.currentUser,
        league: foundLeague
      });
    });
  } else {
    res.redirect('/games');
  }
});

// CREATE
router.post('/', function(req, res) {

  var date = req.body.date.split('-');

  req.body.date = new Date(date[0], date[1]-1, date[2], 0);

  League.findById(req.body.leagueId, function(err, foundLeague) {
    Team.findById(req.body.home, function(err, homeTeam) {
      req.body.home = homeTeam;
      Team.findById(req.body.away, function(err, awayTeam) {
        req.body.away = awayTeam;
        Game.create(req.body, function(err, createdGame) {
          foundLeague.games.push(createdGame);
          foundLeague.save(function(err, data) {
            res.redirect('/leagues/' + req.body.leagueId);
          });
        });
      });
    });
  });
});

// SHOW
router.get('/:id', function(req, res){
	Game.findById(req.params.id, function(err, foundGame){
    League.findOne({'games._id' : req.params.id}, function(err, foundLeague) {
      res.render('games/show.ejs', {
        currentUser: req.session.currentUser,
        game: foundGame,
        league: foundLeague
      });
    });
	});
});

// EDIT
router.get('/:id/edit', function(req, res) {
  if(req.session.currentUser) {
    Game.findById(req.params.id, function(err, foundGame) {
      League.findOne({'games._id' : req.params.id}, function(err, foundLeague) {
        res.render('games/edit.ejs', {
          currentUser: req.session.currentUser,
          game: foundGame,
          league: foundLeague
        });
      });
    });
  } else {
    res.redirect('/leagues');
  }
});

// PUT
router.put('/:id', function(req, res) {
  League.findOne({ 'games._id' : req.params.id }, function(err, foundLeague) {
    Team.findById(req.body.home, function(err, homeTeam) {
      req.body.home = homeTeam;
      Team.findById(req.body.away, function(err, awayTeam) {
        req.body.away = awayTeam;
        Game.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, updatedGame) {
          foundLeague.games.id(req.params.id).remove();
          foundLeague.games.push(updatedGame);
          foundLeague.save(function(err, data) {
            res.redirect('/leagues/' + foundLeague._id);
          });
        });
      });
    });
  });
});

// DELETE
router.delete('/:id', function(req, res) {
  Game.findByIdAndRemove(req.params.id, function() {
    League.findOne({ 'games._id' : req.params.id }, function(err, foundLeague) {
      foundLeague.games.id(req.params.id).remove();
      foundLeague.save(function(err, savedLeague) {
        res.redirect('/leagues');
      });
    });
  });
});

module.exports = router;
