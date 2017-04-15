var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: {type: String, required: true},
  wins: {type: Number, default: 0},
  losses: {type: Number, default: 0},
  ties: {type: Number, default: 0},
  points: {type: Number, default: 0},
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
