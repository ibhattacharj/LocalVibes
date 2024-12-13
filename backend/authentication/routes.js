const express = require("express");
const passport = require("./auth/passport");
const { 
    register, 
    login, 
    logout,  
  } = require("./controller");
const { isAuthenticated } = require("./auth/middleware");
const path = require("path");

//initialize Router
const router = express.Router();

// Routes for registration and login
router.post('/register', register);
router.post('/login', login);
router.get("/logout", logout);

//Routes for file generation
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/source/components/login/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/source/components/login/signup.html"));
});

router.get('/logincss', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/components/login/login.css'));
});

router.get('/appcss', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/main.css'));
});

router.get('/eventpagecss', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/components/eventPage/eventPage.css'));
});

router.get('/login.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/components/login/login.js'));
});

router.get('/main.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/main.js'));
});

router.get('/eventCreationForm.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/components/eventCreationForm/eventCreationForm.js'));
});

router.get('/eventPage.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/components/eventPage/eventPage.js'));
});

router.get('/fakeData.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/source/fakeData.js'));
});


// Google Authentication routes
router.get(
    "/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://127.0.0.1:5500/frontend/source/index.html",
    failureRedirect: "http://127.0.0.1:4000/",
  })
);

// Route for root URL
router.get("/", (req, res) => {
  //Check if the user is authenticated, if they are, bring them to the home page, if not, direct them to the login page
  if (!req.isAuthenticated()) {
    console.log("not signed in");
    res.sendFile(path.join(__dirname, "../../frontend/source/components/login/login.html"));
  } else {
    console.log("authenticated");
    res.sendFile(path.join(__dirname, "../frontend/source/index.html"));
  }
  // console.log("not signed in");
  // res.sendFile(path.join(__dirname, "../../frontend/source/components/login/login.html"));
});

//Protected routes
//Check if the user is authenticated, if they are, allow home page access
router.get("/home", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/source/index.html"));
});

//Route to get profile page
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/source/profile.html"));
});

//Export Router
module.exports = router; 