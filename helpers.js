// URL DATABASE
const urlDatabase = {
	b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
	'9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
};

// USER DATABASE
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

module.exports = { verifyUser, verifyUserEmail, rndmStr, urlDatabase, users };
