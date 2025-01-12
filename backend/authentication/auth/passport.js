const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const { User } = require("../../database.js"); 

// Load environment variables from a .env file
dotenv.config();

console.log("CLIENT_ID:", process.env.CLIENT_ID);  // Log to verify it's being loaded
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);

passport.use(
    //set up google strategy
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        //google callback url must match
        callbackURL: "http://127.0.0.1:4000/auth/google/callback",
        scope: ["profile", "email"],
      },
      
      async (accessToken, refreshToken, profile, done) => {
        try{
        console.log(profile);
        console.log(profile.emails);
        //check if user already exists
        let user = await User.findOne({ where: { user_id: profile.id } });
        //if user does not already exist, create one
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: 'google_auth',  // Use a default or generated password
            user_id: profile.id,
            created_events: '',  // Set empty
            interested_events: '',
            upcoming_events: '',
            past_events: '',
          });
          console.log("User created:", user);
        } else {
          console.log("User found:", user);
        }
        done(null, user);
      } catch (error) {
        console.error("Error during user creation or retrieval:", error);
        done(error, null);
      }
      }
    )
);

passport.serializeUser((user, done) => done(null, user.user_id));

passport.deserializeUser(async (user_id, done) => {
  const user = await User.findOne({ where: { user_id } });
  done(null, user);
});

module.exports = passport;