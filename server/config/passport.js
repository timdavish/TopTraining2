
// Dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Define our passport login authentication strategy
passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, password, done) {
    User.findOne({ 'contact.email': email }).then(function(user) {
		if (!user || !user.validPassword(password)) {
            return done(null, false, { errors: { 'email or password': 'is invalid' } });
        }
        // Success
        return done(null, user);
    }).catch(done);
}));
