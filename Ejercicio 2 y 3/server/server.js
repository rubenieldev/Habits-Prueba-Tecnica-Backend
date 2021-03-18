const express = require('express');
const fs = require('fs');
//const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const APP_PORT = 3000;

const	OAuth2Server = require('oauth2-server');
const	Request = OAuth2Server.Request;
const	Response = OAuth2Server.Response;

// Express APP start
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/index', (req, res) => {
	res.render('index.pug', { mensaje: 'Inventarios' }); 
});

app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 60,
	debug: true,
	allowBearerTokensInQueryString: true
});

const server = app.listen(APP_PORT, () => {
	console.log(`App running on port ${APP_PORT}`)
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log('a user connected')
	socket.on('chatter', function(message) {
		console.log('message : ' + message);
	});
});

app.set('socketio', io);

// Configuring the database
const dbConfig = require('../config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



// middleware to create token
function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);
	console.log('body',req.body)

	return app.oauth.token(request, response)
		.then(function(token) {

			token.token = token.accessToken
			let obj = {};
			obj["access_token"] =  token.accessToken;
			obj["token_type"] =  "Bearer";
			obj['accessTokenExpiresAt'] = token.accessTokenExpiresAt;
			res.json(obj);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

// middleware to check token
function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {
			console.log(request.body,request.headers)

			next();
		}).catch(function(err) {
			console.log(err)

			res.status(err.code || 500).json(err);
		});
}

// endpoint for get token
app.all('/oauth/token', obtainToken);


app.get('/', authenticateRequest, function(req, res) {
	console.log(req.body,req.headers)
	res.json({data:"Congratulations, you are in a secret area!"});
});

// Require Inventario routes
require('../app/routes/inventario.routes')(app, authenticateRequest);


