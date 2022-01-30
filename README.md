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

!["Screenshot of registration page"](https://github.com/brandonDahlberg/tinyapp2/blob/master/docs/registration_page.png?raw=true)
!["Screenshot of login page"](https://github.com/brandonDahlberg/tinyapp2/blob/master/docs/login_page.png?raw=true)
!["Screenshot of home when logged in page"](https://github.com/brandonDahlberg/tinyapp2/blob/master/docs/home_page.png?raw=true)
!["Screenshot of home page when not logged in"](https://github.com/brandonDahlberg/tinyapp2/blob/master/docs/home_page_not_logged_in.png?raw=true)
!["Screenshot of edit URLs page"](https://github.com/brandonDahlberg/tinyapp2/blob/master/docs/edit_url.png?raw=true)

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
