var express = require('express');
var router = express.Router();

var League = require('../models/leagues.js');
var Team = require('../models/teams.js');

// INDEX
router.get('/', function(req, res) {
  League.find({}, function(err, leagues) {
    var sports = [];

    for (var i = 0; i < leagues.length; i++) {
      if (!sports.includes(leagues[i].sport)) {
        sports.push(leagues[i].sport)
      }
    }

    res.render('leagues/index.ejs', {
      currentUser: req.session.currentUser,
      leagues: leagues,
      sports : sports
    });
  });
});

// NEW
router.get('/new', function(req, res) {
  if(req.session.currentUser) {
    res.render('leagues/new.ejs', {
      currentUser: req.session.currentUser
    });
  } else {
    res.redirect('/leagues');
  }
});

// CREATE
router.post('/', function(req, res) {
  League.create(req.body, function(err, league) {
    res.redirect('/leagues');
  });
});

// SHOW
router.get('/:id', function(req, res){
	League.findById(req.params.id, function(err, league){
		res.render('leagues/show.ejs', {
      currentUser: req.session.currentUser,
			league: league
		});
	});
});

// EDIT
router.get('/:id/edit', function(req, res) {
  if(req.session.currentUser) {
    League.findById(req.params.id, function(err, league) {
      res.render('leagues/edit.ejs', {
        currentUser: req.session.currentUser,
        league: league
      });
    });
  } else {
    res.redirect('/leagues/');
  }
});

// PUT
router.put('/:id', function(req, res) {
  League.findByIdAndUpdate(req.params.id, req.body, function() {
    res.redirect('/leagues/' + req.params.id);
  });
});

// DELETE
router.delete('/:id', function(req, res) {
  League.findByIdAndRemove(req.params.id, function(err, foundLeague) {
    var teamIds = [];

    for (var i = 0; i < foundLeague.teams.length; i++) {
      teamIds.push(foundLeague.teams[i]._id);
    }

    Team.remove(
      {
        _id : {
          $in: teamIds
        }
      },
      function(err, data) {
        res.redirect('/leagues');
      }
    );
  });
});

module.exports = router;
