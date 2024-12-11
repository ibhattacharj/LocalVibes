const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./authentication/auth/passport");
const routes = require("./authentication/routes");
const path = require("path");
const { Event, sequelize, User } = require("./database.js");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Sequelize } = require("sequelize");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Files go to 'uploads' folder

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000; // Default port is 4000 if not provided

// Allow for static files
app.use(express.static(path.join(__dirname, "frontend/source")));

// Middleware for parsing JSON bodies in requests
app.use(express.json());

// Configure session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

// Use routes from routes.js
app.use("/", routes);

// Configure CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Restrict access to this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Verify database connection
sequelize
  .authenticate()
  .then(() =>
    console.log("Database connection has been established successfully.")
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

// Endpoint to fetch popular events
app.get("/events/popular", async (req, res) => {
  try {
    const popularEvents = await Event.findAll({
      order: [["views", "DESC"]],
      limit: 10,
    });
    res.status(200).json(popularEvents || []);
  } catch (error) {
    console.error("Error fetching popular events:", error);
    res.status(500).json({ error: "Failed to fetch popular events" });
  }
});

// Endpoint to fetch personalized events
app.get("/events/for-you", async (req, res) => {
  try {
    const events = await Event.findAll(); // Future: Implement user preference filtering
    res.status(200).json(events || []);
  } catch (error) {
    console.error("Error fetching personalized events:", error);
    res.status(500).json({ error: "Failed to retrieve personalized events" });
  }
});

// Endpoint to fetch nearby events (demo purposes)
app.get("/events/nearby", async (req, res) => {
  const userLocation = req.query.location; // Expects location as query parameter
  if (!userLocation) {
    return res.status(400).json({ error: "User location required" });
  }
  try {
    const nearbyEvents = await Event.findAll({ limit: 10 }); // Placeholder logic
    res.status(200).json(nearbyEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby events" });
  }
});

// Endpoint to search events
app.get("/events/search", async (req, res) => {
  const { query, genre, location } = req.query;
  const whereClause = {};
  if (query) whereClause.name = { [Sequelize.Op.like]: `%${query}%` };
  if (genre) whereClause.tags = { [Sequelize.Op.like]: `%${genre}%` };
  if (location) whereClause.location = { [Sequelize.Op.like]: `%${location}%` };

  try {
    const searchResults = await Event.findAll({ where: whereClause });
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: "Failed to search events" });
  }
});

// Endpoint to create a new event (with image upload)
app.post("/events", upload.single("eventImage"), async (req, res) => {
  try {
    const { eventName, eventDescription, eventLocation, eventTags, eventTime } =
      req.body;
    const tagsString = Array.isArray(eventTags)
      ? eventTags.join(",")
      : eventTags || "";
    const imagePath = req.file ? req.file.path : null;

    const newEvent = await Event.create({
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      tags: tagsString,
      time: new Date(eventTime),
      image: imagePath, // Store the image path if your model supports it
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update an event
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.update(req.body, { where: { id } });
    if (updatedEvent[0] === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Endpoint to delete an event
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.destroy({ where: { id } });
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// Serve the index.html file for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/source", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
