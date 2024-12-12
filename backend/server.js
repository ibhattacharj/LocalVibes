const { Event, sequelize, User } = require("./database.js");
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Files go to 'uploads' folder
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());


app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Adjust this to match your frontend address
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files from frontend if needed
app.use(express.static(path.join(__dirname, "../frontend/source")));


// Verify database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected."))
  .catch((err) => console.error("Database connection failed:", err));


  // Endpoint to fetch popular events
app.get("/events/popular", async (req, res) => {
  try {
    const popularEvents = await Event.findAll({
      order: [["views", "DESC"]],
      limit: 10,
    });
    if (!popularEvents || popularEvents.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(popularEvents);
  } catch (error) {
    console.error("Error fetching popular events:", error);
    res.status(500).json({ error: "Failed to fetch popular events" });
  }
});


app.get("/events/for-you", async (req, res) => {
  try {
    console.log("Received request for personalized events");
    if (!sequelize) {
      console.error("Sequelize instance is not available.");
    } else {
      console.log("Sequelize instance is available.");
    }
    if (!Event) {
      console.error("Event model is not defined");
      return res.status(500).json({ error: "Event model not available" });
    }
    const events = await Event.findAll(); //for now returns all events

    if (!events || events.length === 0) {
      console.log("No popular events found.");
    } else {
      console.log("Fetched popular events:", JSON.stringify(events, null, 2));
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching personalized events:", error);
    res.status(500).json({ error: "Failed to retrieve personalized events" });
  }
});



// Endpoint to create a new event (with image upload)
app.post("/events", upload.single("eventImage"), async (req, res) => {
  try {
    const { eventName, eventDescription, eventLocation, eventTags, eventTime } =
      req.body;
    // eventTags can be a single string or multiple values, depending on the form submission
    // If multiple tags are submitted with the same name, they'll be returned as an array.
    let tagsArray = [];
    if (Array.isArray(eventTags)) {
      tagsArray = eventTags;
    } else if (typeof eventTags === "string" && eventTags.trim() !== "") {
      tagsArray = [eventTags.trim()];
    }
    const tagsString = tagsArray.join(",");
    let imagePath = null;
    if (req.file) {
      // If you have an image column in your Event model, you can store the file path here
      imagePath = req.file.path;
      // Consider renaming or moving the file, or uploading to a cloud storage service
    }

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

// Serve the index.html file for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/source", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});