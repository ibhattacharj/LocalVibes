const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../database");

dotenv.config();

// Helper functions
// This function creates a response object with a status and a message.
const factoryResponse = (status, message) => ({ status, message });

const existsUser = async (username) => {
    const user = await User.findOne({ where: { username } });
    return user;
};

// Registration route.
// This route creates a new user in the database.
const register = async (req, res) => {
    const { username, password } = req.body;
  
    // Check if the username is already taken
    if (await existsUser(username))
      return res.status(400).json(factoryResponse(400, "Username already taken"));
  
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.json(factoryResponse(200, "Registration successful"));
    console.log("User registered successfully");
  };

// Login route.
// This route checks the user's credentials and logs them in.
const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json(factoryResponse(401, "Invalid credentials"));
  }

  // Log the user in using the req.login() function provided by Passport.
  // This function establishes a login session for the user. The user object
  // is serialized and stored in the session. It can be accessed in subsequent
  // requests using req.user.
  req.login(user, (err) =>
    err ? next(err) : res.json(factoryResponse(200, "Login successful"))
  );
};

// Logout route.
// This route logs the user out.
// The req.logout() function is provided by Passport. It removes the user's
// session and logs them out.
const logout = (req, res) => {
    req.logout(function (err) {
      if (err) {
        res.json(factoryResponse(500, "Logout failed"));
        return;
      }
      res.redirect("/login");
    });
};

// Google Authentication callback route.
// This route is called by Google after the user has authenticated.
// It redirects the user to the home page.
const googleAuthCallback = (req, res) => {
    //res.redirect("../frontend/source/index.html");
    res.send("this would be the home page after successful login");
};

// Profile route.
// This route is protected by the isAuthenticated middleware.
// It returns a welcome message to the user.
const getProfile = (req, res) => {
    res.json(factoryResponse(200, `Welcome, ${req.user.username}`));
};

// Home page route.
// Protected by isAuthenticated middleware.
// Brings user to the home page which is index.html
const bringHome = (req, res) => {
  res.send("hello");
};

module.exports = { register, login, logout, googleAuthCallback, getProfile, bringHome };