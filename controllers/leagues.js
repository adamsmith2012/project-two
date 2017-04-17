var express = require('express');
var router = express.Router();

var League = require('../models/leagues.js');
var Team = require('../models/teams.js');

// INDEX
router.get('/', function(req, res) {
  League.find({}, function(err, leagues) {
    res.render('leagues/index.ejs', {
      currentUser: req.session.currentUser,
      leagues: leagues
    });
  });
});

// NEW
router.get('/new', function(req, res) {
  res.render('leagues/new.ejs', {
    currentUser: req.session.currentUser
  });
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
  League.findById(req.params.id, function(err, league) {
    res.render('leagues/edit.ejs', {
      currentUser: req.session.currentUser,
      league: league
    });
  });
});

// PUT
router.put('/:id', function(req, res) {
  League.findByIdAndUpdate(req.params.id, req.body, function() {
    res.redirect('/leagues');
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
