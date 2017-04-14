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

//var photosController = require('./controllers/photos.js');
//app.use('/photos', photosController);

// LISTENERS

app.get('/', function(req, res) {
  res.render('index.ejs');
});

//
// /*** SEED DATA ***/
// app.get('/seed/newusers', function(req, res) {
//
//
//   var newPhotos = [
//     {
//       username: "Dave",
//       img: "http://sodomojo.com/files/2015/07/mlb-los-angeles-angels-seattle-mariners.jpg",
//       description: "Safeco Field, Seattle"
//     },
//     {
//       username: "Dave",
//       img: "https://media-cdn.tripadvisor.com/media/photo-s/01/56/c2/01/san-diego-skyline.jpg",
//       description: "San Diego, California"
//     },
//     {
//       username: "Kate",
//       img: "https://cdn-s3.si.com/s3fs-public/styles/mmqb_marquee_large/public/2015/01/centurylink-960.jpg?itok=hgz10rjm",
//       description: "CenturyLink Field, Seattle"
//     },
//     {
//       username: "Steve",
//       img: "http://grfx.cstv.com/schools/gonz/graphics/McCarthey-Athletic-Center-1sm-crop.jpg",
//       description: "McCarthey Athletic Center, Gonzaga"
//     }
//   ];
//
//   Photo.create(newPhotos, function(err, photos) {
//
//     console.log("SEED: NEW PHOTOS CREATED!");
//
//     console.log(photos[0]);
//
//   	var newUsers = [
//   		{
//   			username: "Dave",
//   			password: "abcd1234",
//   	    photos: [ photos[0], photos[1]]
//   		},
//   		{
//   			username: "Kate",
//   			password: "abcd1234",
//         photos: [ photos[2] ]
//   		},
//   		{
//   			username: "Steve",
//   			password: "abcd1234",
//         photos: [ photos[3] ]
//   		},
//   	];
//
//   	User.create(newUsers, function(err) {
//   		  console.log("SEED: NEW USERS CREATED!");
//   		  res.redirect('/');
//   	});
//   });
//
// });


mongoose.connect('mongodb://localhost:27017/sports');
mongoose.connection.once('open', function() {
  console.log("Connected to mongo");
});

app.listen(3000, function() {
  console.log("Listening...");
});
