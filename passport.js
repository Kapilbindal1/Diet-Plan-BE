const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4001/auth/callback'
},
function (request, accessToken, refreshToken, profile, done){
    return done(null, profile);
}
))

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});