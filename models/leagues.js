var mongoose = require('mongoose');

var Team = require('./teams.js');

var leagueSchema = mongoose.Schema({
  name: {type: String, required: true},
  sport: {type: String, required: true},
  // teams: [Team.schema]
});

var League = mongoose.model('Photo', leagueSchema);

module.exports = League;
