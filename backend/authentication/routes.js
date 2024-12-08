// import express from "express";
// import passport from "../authentication/auth/passport.js"; //try to fix this, haven't changed yet
// import {
//   register,
//   login,
//   logout,
//   googleAuthCallback,
//   getProfile,
// } from "../authentication/controller.js"; //try to fix this, haven't changed yet
// import { isAuthenticated } from "../authentication/auth/middleware.js"; //try to fix this, haven't changed yet

const express = require("express");
const passport = require("./auth/passport");
//const passport = require('passport');
const { 
    register, 
    login, 
    logout, 
    googleAuthCallback, 
    getProfile,
    bringHome
  } = require("./controller");
const { isAuthenticated } = require("./auth/middleware");
const path = require("path");

const router = express.Router();

// Routes for registration and login
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Google Authentication routes
router.get(
    "/auth/google", 
    passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  //passport.authenticate("google", { failureRedirect: "/" }),
  //googleAuthCallback
  passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/"
  })
);

// Route for root URL
router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    console.log("not signed in");
    res.sendFile(path.join(__dirname, "../../frontend/source/components/login/login.html"));
  } else {
    console.log("authenticated");
    res.sendFile(path.join(__dirname, "../frontend/source/index.html"));
  }
});

// Protected routes
router.get("/home", isAuthenticated, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

router.get("/profile", isAuthenticated, getProfile);


//export default router;
module.exports = router; 