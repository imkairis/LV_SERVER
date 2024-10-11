const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const config = require('./config');

passport.use(new GoogleStrategy({
  clientID: config.ggClientId,
  clientSecret: config.ggClientSecret,
  callbackURL: "/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        username: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        isAdmin: false,
        googleId: profile.id,
      });
      await user.save();
    }

    const payload = { id: user.id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, config.secretKey, { expiresIn: config.expiresIn });

    return done(null, { user, token });
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport