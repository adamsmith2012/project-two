var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: {type: String, required: true}
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
