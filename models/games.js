var mongoose = require('mongoose');

var Team = require('./teams.js');

var gameSchema = mongoose.Schema({
  date: {type: Date, required: true},
  location: {type: String, default: "TBA"},
  home: Team.schema,
  homeScore: {type: Number, default: 0},
  away: Team.schema,
  awayScore: {type: Number, default: 0}
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
