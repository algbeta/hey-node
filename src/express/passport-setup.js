const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const facebookAuth = {
  clientID: 'your-client-id',
  clientSecret: 'your-app-secret',
  callbackURL: 'http://localhost:8080/auth/facebook/callback'
};

const twitterAuth = {
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-consumer-secret',
  callbackURL: 'http://127.0.0.1:8080/auth/twitter/callback'
};

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new FacebookStrategy(facebookAuth, (token, refreshToken, profile, done) => {
      if (profile && profile.id) {
        console.log(JSON.stringify(profile));
        done(null, profile);
      } else {
        done({
          message: 'facebook login failed!'
        });
      }
    })
  );

  passport.use(
    new TwitterStrategy(twitterAuth, (token, tokenSecret, profile, done) => {
      if (profile && profile.id) {
        console.log(JSON.stringify(profile));
        done(null, profile);
      } else {
        done({
          message: 'twitter login failed!'
        });
      }
    })
  );
};
