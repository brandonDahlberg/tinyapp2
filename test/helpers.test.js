const { assert } = require('chai');

const { verifyUser, verifyUserEmail, rndmStr, urlDatabase, users } = require('../helpers.js');

const testUsers = {
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

const { email, password } = testUsers.userRandomID;

describe('getUserByEmail', function () {
	it('should return a user with valid email', function () {
		const user = verifyUser(email, password).id;
		const expectedUserID = 'userRandomID';
		assert.equal(user, expectedUserID);
	});
	it('should return a udefined if email is not in the database', function () {
		const user = verifyUser('hello@there.com', password).id;
		const expectedUserID = undefined;
		assert.equal(user, expectedUserID);
	});
});
