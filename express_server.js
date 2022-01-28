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

// URL-DATABASE
const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

// USERS DATABASE
const users = {
	userRandomID: {
		id: 'userRandomID',
		email: 'user@example.com',
		password: 'purple-monkey-dinosaur',
	},
	user2RandomID: {
		id: 'user2RandomID',
		email: 'user2@example.com',
		password: 'dishwasher-funk',
	},
};

// GENERATE RANDOM STRING1
const rndmStr = function () {
	let rndmStr = (Math.random() + 1).toString(36).substring(7);
	return rndmStr;
};

// Register POST
app.post('/register', (req, res) => {
	const newID = rndmStr();
	const newEmail = req.body.email;
	const newPassword = req.body.password;
	users[newID] = { id: newID, email: newEmail, password: newPassword };
	res.redirect('/home');
});
// Register GET
app.get('/register', (req, res) => {
	res.render('register');
});

// Login GET
app.get('/login', (req, res) => {
	res.render('login');
});

const verifyUser = function (email, password) {
	for (let id in users) {
		if (users[id].email === email && users[id].password === password) return users[id];
	}
	return null;
};

// Login POST
app.post('/login', (req, res) => {
	const candidateEmail = req.body.email;
	const candidatePassword = req.body.password;
	const userObj = verifyUser(candidateEmail, candidatePassword);
	if (userObj) {
		res.cookie('user_id', userObj.id);
		res.redirect('/home');
	}
});

// Login GET
app.get('/login', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
	res.render('home', tempVars);
});
// Logout POST
app.post('/logout', (req, res) => {
	res.clearCookie('user_id', req.body.user_id);
	res.redirect('/login');
});
/* UPDATE DATABASE AND HOME PAGE WITH { SHORT-URL : LONG-URL } 
    FROM CREATE URL PAGE */
app.post('/home', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = rndmStr();
	urlDatabase[shortURL] = longURL;
	res.redirect(`/home`);
});

// HANDLES POST REQUESTS FROM EDIT FORM ON SHOW PAGE
app.post('/home/:shortURL', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = req.params.shortURL;
	const tempVars = { longURL: longURL, shortURL: shortURL };
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
	const tempVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
	res.render('home', tempVars);
});

// RENDER CREATE SHORT-URL PAGE
app.get('/home/createURL', (req, res) => {
	const tempVars = {
		user: users[req.cookies['user_id']],
	};
	res.render('createURL', tempVars);
});
// RENDER SHOW SHORTURL PAGE
app.get('/home/:shortURL', (req, res) => {
	const url = urlDatabase[req.params.shortURL];
	const tempVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
		user: users[req.cookies['user_id']],
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
