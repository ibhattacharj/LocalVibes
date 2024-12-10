const { Event, sequelize, User } = require("./database.js");
const express = require("express");
const cors = require("cors");
const multer = require("multer"); // For handling file uploads
const { Sequelize } = require("sequelize");

const app = express();
//const PORT = process.env.PORT || 5000; //set port. Defaults to 5000 if not provided
const PORT = process.env.PORT || 4000; //set port. Defaults to 5000 if not provided

//middleware for parsing JSON bodies in requests
app.use(express.json());


// Configure CORS to allow requests from front-end origin specified by proceeding URL
app.use(
  cors({
    origin: "http://127.0.0.1:5500", //restrict access to this origin
    methods: ["GET", "POST", "PUT", "DELETE"], //allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], //allowed headers
  })
);

// Authenticate Sequelize connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage });

// Middleware to validate if the current user is the host of the event
const validateHost = async (req, res, next) => {
  try {
    const { id } = req.params; // Get event ID from request parameters
    const user = req.body.user; // Assuming user info is sent in the request body (replace with actual user auth logic)

    // Find the event in the database
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the current user is the host
    if (event.host !== user) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You are not the host of this event" });
    }

    // Proceed to the next middleware or handler
    next();
  } catch (error) {
    console.error("Error validating host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Routes

// Popular events endpoint
app.get("/events/popular", async (req, res) => {
  try {
    const popularEvents = await Event.findAll({
      order: [["views", "DESC"]],
      limit: 10,
    });
    res.status(200).json(popularEvents);
  } catch (error) {
    console.error("Failed to fetch popular events:", error);
    res.status(500).json({ error: "Failed to fetch popular events" });
  }
});

// Events for You endpoint
app.get("/events/for-you", async (req, res) => {
  try {
    const events = await Event.findAll(); // Placeholder for filtering logic
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching personalized events:", error);
    res.status(500).json({ error: "Failed to retrieve personalized events" });
  }
});

// Fetch event details by ID
app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

// Create a new event (includes image upload)
app.post("/events", upload.single("eventImage"), async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      eventLocation,
      eventTags,
      eventTime,
      user,
    } = req.body;

    // Validate input fields
    if (
      !eventName ||
      !eventDescription ||
      !eventLocation ||
      !eventTime ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required, including an image." });
    }

    // Create a new event
    const newEvent = await Event.create({
      name: eventName,
      description: eventDescription,
      host: user || "Default Host", // Use "Default Host" if user is not provided
      location: eventLocation,
      tags: eventTags.join(", "), // Convert array to comma-separated string
      time: eventTime,
      comments: "", // Default comments
      views: 0, // Default views
      image: req.file.path, // Store file path if an image was uploaded
    });

    // Return success response with detailed event info
    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: newEvent.id,
        name: newEvent.name,
        description: newEvent.description,
        location: newEvent.location,
        time: newEvent.time,
        tags: newEvent.tags,
        image: newEvent.image,
      },
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update an event
app.put("/events/:id", validateHost, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.update(req.body, { where: { id } });
    if (updatedEvent[0] === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    console.error("Failed to update event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete an event
app.delete("/events/:id", validateHost, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.destroy({ where: { id } });
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
