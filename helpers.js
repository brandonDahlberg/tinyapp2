// URL DATABASE
const urlDatabase = {
	b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userId: 'userRandomId' },
	'9sm5xK': { longURL: 'http://www.google.com', userId: 'user2RandomId' },
};

// USER DATABASE
const users = {
	userRandomId: {
		id: 'userRandomId',
		email: 'user@example.com',
		password: 'purple-monkey-dinosaur',
	},
	user2RandomId: {
		id: 'user2RandomId',
		email: 'user2@example.com',
		password: 'dishwasher-funk',
	},
};

// GENERATE RANDOM STRING
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

const verifyUserEmail = function (email, userDB) {
	for (let id in userDB) {
		if (userDB[id].email === email) return userDB[id];
	}
	return false;
};

const getUserURLs = function (urlDatabase, session_id) {
	let userURLs = {};
	for (let shortURL in urlDatabase) {
		if (urlDatabase[shortURL].userId === session_id) {
			userURLs[shortURL] = urlDatabase[shortURL].longURL;
		}
	}
	return userURLs;
};

module.exports = { verifyUser, verifyUserEmail, rndmStr, urlDatabase, users, getUserURLs };
