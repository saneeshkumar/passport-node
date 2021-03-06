const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
});

passport.use(
    new GoogleStrategy({
        //options for the strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback
        // Check if user already exists in database.
        console.log(profile);
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // Already have the user
                done(null, currentUser);
            } else {
                // Create user in db
                //save new user to database
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });

    })
);
