// TINY APP WITH EXPRESS
const express = require('express');
const PORT = 3003;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// DATABASE
const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

// GENERATE RANDOM NUMBER
const rndmNum = function () {
	let rndmStr = (Math.random() + 1).toString(36).substring(7);
	return rndmStr;
};

// Login
app.post('/login', (req, res) => {
	res.cookie('username', req.body.username);
	res.redirect('/home');
});

// Logout
app.post('/logout', (req, res) => {
	res.clearCookie('username', req.body.username);
	res.redirect('/home');
});
/* UPDATE DATABASE AND HOME PAGE WITH { SHORT-URL : LONG-URL } 
    FROM CREATE URL PAGE */
app.post('/home', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = rndmNum();
	urlDatabase[shortURL] = longURL;
	res.redirect(`/home`);
});

// HANDLES POST REQUESTS FROM EDIT FORM ON SHOW PAGE
app.post('/home/:shortURL', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = req.params.shortURL;
	const tempVars = { longURL, shortURL, username: req.cookies['username'] };
	urlDatabase[shortURL] = longURL;
	res.render('show', tempVars);
});

// DELETE URLS
app.post('/home/:shortURL/delete', (req, res) => {
	const shortURL = req.params.shortURL;
	delete urlDatabase[shortURL];
	res.redirect('/home');
});

// RENDER HOME PAGE
app.get('/home', (req, res) => {
	const tempVars = { urls: urlDatabase, username: req.cookies['username'] };
	res.render('home', tempVars);
});

// RENDER CREATE SHORT-URL PAGE
app.get('/home/createURL', (req, res) => {
	const tempVars = {
		username: req.cookies['username'],
	};
	res.render('createURL', tempVars);
});

// RENDER SHOW SHORTURL PAGE
app.get('/home/:shortURL', (req, res) => {
	const url = urlDatabase[req.params.shortURL];
	const tempVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
		username: req.cookies['username'],
	};
	res.render('show', tempVars);
});

// REDIRECTS BROWSER TO WEBPAGE OF LONG-URL BASED ON SHORT-URL
app.get('/u/:shortURL', (req, res) => {
	const shortURL = req.params.shortURL;
	const longURL = urlDatabase[shortURL];
	if (longURL) {
		res.redirect(longURL);
	} else if (!longURL) {
		res.status(404).send('Page Not Found');
	}
});

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
