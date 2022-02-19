// TINY APP WITH EXPRESS
const express = require('express');
const PORT = 3003;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { verifyUser, verifyUserEmail, rndmStr, urlDatabase, users, getUserURLs } = require('./helpers');

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cookieSession({
		name: 'session',
		keys: ['Aura smells like wet dog', 'Toothless is so ruthless'],
	})
);

// Register GET
app.get('/register', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.session.user_id] };
	res.render('register', tempVars);
});

// Login GET
app.get('/login', (req, res) => {
	const tempVars = { urls: urlDatabase, user: users[req.session.user_id] };
	res.render('login', tempVars);
});

// Register POST
app.post('/register', (req, res) => {
	const newId = rndmStr();
	const newEmail = req.body.email;
	const newPassword = req.body.password;
	if (newEmail === '' || newPassword === '') {
		res.status(403).send('Username name or email fields');
	}
	const userObj = verifyUserEmail(newEmail, users);
	if (userObj) {
		res.status(403).send('user already exists');
	} else if (!userObj) {
		users[newId] = { id: newId, email: newEmail, password: newPassword };
		req.session.user_id = users[newId].id;
		res.redirect('/home');
	}

	// Login POST
});
app.post('/login', (req, res) => {
	const candidateEmail = req.body.email;
	const candidatePassword = req.body.password;
	const userObj = verifyUser(candidateEmail, candidatePassword);
	console.log('userObj', userObj);
	if (!userObj) {
		res.status(400).send('Login Invalid!');
	} else if (candidateEmail === '' || candidatePassword === '') {
		res.status(400).send('Username name or email fields cannot be empty.');
	} else if (userObj) {
		console.log('Hellooo');
		req.session.userId = userObj.id;
		console.log(userObj.id);
		res.redirect('/home');
	}
});
// Logout POST
app.post('/logout', (req, res) => {
	res.clearCookie('session');
	res.redirect('/login');
});

// ERROR PAGE
app.get('/error', (req, res) => {
	res.render('error');
});

// GET HOME PAGE
app.get('/home', (req, res) => {
	// console.log('Users', users);
	const sessionId = req.session.userId;
	if (!sessionId) {
		res.redirect('/login');
	} else if (sessionId !== null) {
		const userURLs = getUserURLs(urlDatabase, sessionId);
		// const candidateEmail = req.body.email;
		// const candidatePassword = req.body.password;
		// const userObj = verifyUser(candidateEmail, candidatePassword);
		console.log('userURLs: ', userURLs);
		console.log('USER!!!!!', req.session.userId);
		const tempVars = {
			// userObj: userObj,

			user: users[req.session.userId],
			urls: userURLs,
		};
		res.render('home', tempVars);
	}
});

// RENDER CREATE SHORT-URL PAGE
app.get('/home/createURL', (req, res) => {
	const session_id = req.session.userId;
	const tempVars = {
		user: users[req.session.userId],
	};
	if (session_id) {
		res.render('createURL', tempVars);
	} else {
		res.render('createURL', tempVars);
	}
});

/* UPDATES DATABASE AND HOME PAGE WITH { SHORT-URL : LONG-URL }
  FROM CREATE URL PAGE */
app.post('/home', (req, res) => {
	const longURL = req.body.longURL;
	const shortURL = rndmStr();
	urlDatabase[shortURL] = { longURL, userId: req.session.userId };
	res.redirect('/home');
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
	const tempVars = {
		user: users[req.session.userId],
		urls: getUserURLs(urlDatabase, req.session.userId),
		longURL: longURL,
		shortURL: shortURL,
	};
	res.render('home', tempVars);
});

// EDIT BUTTON ON HOME PAGE
app.get('/home/:shortURL', (req, res) => {
	const shortURL = req.params.shortURL;
	const cookieId = req.session.userId;
	const userId = urlDatabase[shortURL].userId;
	const tempVars = {
		cookieId: req.session.userId,
		userId: urlDatabase[shortURL].userId,
		shortURL: req.params.shortURL,
		longURL: urlDatabase[shortURL],
		user: users[req.session.userId],
	};
	if (cookieID) {
		// make sure user is logged in and the urls belong to them.
		if (userId && cookieId === userId) {
			res.render('show', tempVars);
		} else {
			res.redirect('/error');
		}
	}
});

// DELETE BUTTON ON HOME PAGE
app.post('/home/:shortURL/delete', (req, res) => {
	const shortURL = req.params.shortURL;
	const cookieId = req.session.userId;
	const userId = urlDatabase[shortURL].userId;
	if (cookieId) {
		// make sure user is logged in and the urls belong to him.
		if (userId && cookieId === userId) {
			delete urlDatabase[shortURL];
			res.redirect('/home');
		} else {
			res.redirect('/error');
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
