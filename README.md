# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

The application allows you to create short urls, but that's not all! It is has many security features, such as:

- Does not allow users to access or view urls if they are not logged in or register.
- Does not allow users to edit or delete urls that do not belong to them.
- Does not allow users to create multiple accounts with the same email.
- Does not allow users to login with invalid login credentials ie. incorrect email or password, password does not correspond with email, did not fill in one or more fields for login or register.
- Shows username in header when logged in and logout button.
- Shows login and register buttons if not logged into your account.

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` or npm start command to run using nodemon.
