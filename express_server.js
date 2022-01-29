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
	b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
	'9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
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

const verifyUser = function (email, password) {
	for (let id in users) {
		if (users[id].email === email && users[id].password === password) return users[id];
	}
	return false;
};
const verifyUserEmail = function (email) {
	for (let id in users) {
		if (users[id].email === email) return users[id];
	}
	return false;
};

//
// POST REQUESTS
//

/* UPDATE DATABASE AND HOME PAGE WITH { SHORT-URL : LONG-URL }
  FROM CREATE URL PAGE */
app.post('/home', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = rndmStr();
	urlDatabase[shortURL] = { longURL, userID: req.cookies['user_id'] };
	res.redirect('/home');
});

// Register POST
app.post('/register', (req, res) => {
	const newID = rndmStr();
	const newEmail = req.body.email;
	const newPassword = req.body.password;
	const userObj = verifyUserEmail(newEmail);
	if (userObj) {
		res.status(403).send('user already exists');
	} else if (!userObj) {
		users[newID] = { id: newID, email: newEmail, password: newPassword };
		res.cookie('user_id', users[newID].id);
		res.redirect('/home');
	}

	// Login POST
	app.post('/login', (req, res) => {
		const candidateEmail = req.body.email;
		const candidatePassword = req.body.password;
		const userObj = verifyUser(candidateEmail, candidatePassword);
		if (userObj) {
			res.cookie('user_id', userObj.id);
			res.redirect('/home');
		} else res.send('Login Invalid');
	});
});

// Login GET
app.get('/login', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
	res.render('login', tempVars);
});

// Logout POST
app.post('/logout', (req, res) => {
	res.clearCookie('user_id');
	res.redirect('/login');
});

// Register GET
app.get('/register', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
	res.render('register', tempVars);
});

// RENDER HOME PAGE GET
app.get('/home', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
	res.render('home', tempVars);
});

// RENDER CREATE SHORT-URL PAGE
app.get('/home/createURL', (req, res) => {
	const tempVars = {
		user: users[req.cookies['user_id']],
	};
	if (req.cookies['user_id']) {
		res.render('createURL', tempVars);
	} else {
		res.redirect('/login');
	}
});

// REDIRECTS BROWSER TO WEBPAGE OF LONG-URL BASED ON SHORT-URL
app.get('/u/:shortURL', (req, res) => {
	const shortURL = req.params.shortURL;
	const longURLObj = urlDatabase[shortURL];
	if (longURLObj) {
		res.redirect(longURLObj.longURL);
	} else if (!longURLObj) {
		res.status(404).send('Page Not Found');
	}
});

// SUBMITS NEW URL ON EDIT PAGE
app.post('/home/:shortURL', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = req.params.shortURL;
	urlDatabase[shortURL].longURL = longURL;
	const tempVars = { user: users[req.cookies['user_id']], urls: urlDatabase, longURL: longURL, shortURL: shortURL };
	res.render('home', tempVars);
});

// EDIT BUTTON ON HOME PAGE
app.get('/home/:shortURL', (req, res) => {
	const shortURL = req.params.shortURL;
	const cookieID = req.cookies['user_id'];
	const userID = urlDatabase[shortURL].userID;
	const tempVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[shortURL],
		user: users[req.cookies['user_id']],
	};
	if (cookieID) {
		// make sure user is logged in and the urls belong to him.
		if (userID && cookieID === userID) {
			res.render('show', tempVars);
		} else {
			res.redirect('/error');
		}
	}
});

// DELETE URLS
app.post('/home/:shortURL/delete', (req, res) => {
	const shortURL = req.params.shortURL;
	const cookieID = req.cookies['user_id'];
	const userID = urlDatabase[shortURL].userID;
	if (cookieID) {
		// make sure user is logged in and the urls belong to him.
		if (userID && cookieID === userID) {
			delete urlDatabase[shortURL];
			res.redirect('/home');
		} else {
			res.redirect('/error');
		}
	}
});

app.get('/error', (req, res) => {
	res.render('error');
});

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
