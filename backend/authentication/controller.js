const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { User } = require("../database");

//Initialize dotenv
dotenv.config();

// Register function
async function register(req, res) {
    const { email, username, password } = req.body;
    try {
        //Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        //Create new user if not
        const newUser = await User.create({ email, username, password});
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error){
        res.status(500).json({ message: 'Error during registration' });
    }
}

//Login function
async function login(req, res) {
    const { username, password } = req.body;
    try {
        //Check if user exists
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        //Verify password
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        //Login successful
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during login' });
    }
}

// Logout route
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

//Export modules
module.exports = { register, login, logout };