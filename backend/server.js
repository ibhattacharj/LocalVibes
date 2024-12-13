const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./authentication/auth/passport"); //import custom Passport config
const routes = require("./authentication/routes"); //routes for authentication
const path = require("path"); //Node.js module for handling file paths

const { Event, sequelize, User } = require('./database.js'); //import database models and connection
const express = require('express'); //framework for building web applications
const cors = require('cors'); //middleware for enabling CORS (Cross-Origin Resource Sharing)

const { Sequelize } = require('sequelize');

const app = express(); //initialize Express app
dotenv.config(); //load environment variables
const PORT = process.env.PORT || 4000; //set server port. Defaults to 4000

//serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "frontend/source")));

//middleware to parse JSON request bodies
app.use(express.json());

//configure session management to handle user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, //session secret from environment variables
    resave: false, //do not save session if its unmodified
    saveUninitialized: false, //do not create session until something is stored
  })
);

//initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

//use authentication routes
app.use("/", routes);

//enable CORS to allow front-end requests
app.use(cors({
    origin: 'http://127.0.0.1:5500', //restrict access to this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] //allowed headers
}));

//connect Sequelize to database and check connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//define endpoint to fetch popular events
app.get('/events/popular', async (req, res) => {
  try {
    console.log('Received request for popular events');

    if (!sequelize) {
      console.error('Sequelize instance is not available.');
    } else {
      console.log('Sequelize instance is available.');
    }

    if (!Event) {
      console.error('Event model is not defined');
      return res.status(500).json({ error: 'Event model not available' });
    }

    const popularEvents = await Event.findAll({
      order: [['views', 'DESC']], //sort by views in descending order
      limit: 10, //return only the top 10 events
    });

    if (!popularEvents || popularEvents.length === 0) {
      console.log('No popular events found.');
    } else {
      console.log('Fetched popular events:', JSON.stringify(popularEvents, null, 2));
    }

    res.status(200).json(popularEvents);
  } catch (error) {
    console.error('Failed to fetch popular events:', error);
    res.status(500).json({ error: 'Failed to fetch popular events', details: error.message });  }
});

//Events for You endpoint
app.get('/events/for-you', async (req, res) => {
    try {
      console.log('Received request for personalized events');

      if (!sequelize) {
        console.error('Sequelize instance is not available.');
      } else {
        console.log('Sequelize instance is available.');
      }

      if (!Event) {
        console.error('Event model is not defined');
        return res.status(500).json({ error: 'Event model not available' });
      }

      const events = await Event.findAll(); //for now returns all events
      
      //would implement filtering logic to determine user preferences here. Tags responsibility changed so I was not able to complete this. 
      
      if (!events || events.length === 0) {
        console.log('No popular events found.');
      } else {
        console.log('Fetched popular events:', JSON.stringify(events, null, 2));
      }

      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching personalized events:', error);
      res.status(500).json({ error: 'Failed to retrieve personalized events' });
    }
});

//endpoint to fetch nearby events (placeholder logic)
app.get('/events/nearby', async (req, res) => {
  const userLocation = req.query.location; //user's location from query parameters
  if (!userLocation) {
    return res.status(400).json({ error: 'User location required' });
  }
  try {
    const nearbyEvents = await Event.findAll({ limit: 10 }); //return top 10 events for now
    res.status(200).json(nearbyEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby events' });
  }
});

//search for events based on query/genre/location
app.get('/events/search', async (req, res) => {
  const { query, genre, location } = req.query;
  const whereClause = {}; //build query dynamically based on provided filters
  if (query) {
    whereClause.name = { [Sequelize.Op.like]: `%${query}%` }; //search by event name
  }
  if (genre) {
    whereClause.tags = { [Sequelize.Op.like]: `%${genre}%` }; //filter by tags
  }
  if (location) {
    whereClause.location = { [Sequelize.Op.like]: `%${location}%` }; //search by location
  }

  try {
    const searchResults = await Event.findAll({ where: whereClause });
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search events' });
  }
});

//create new event
app.post('/events', async (req, res) => {
  try {
    const newEvent = await Event.create(req.body); //insert event into the database
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

//update an existing event by ID
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params; //get event ID from request params
    const updatedEvent = await Event.update(req.body, { where: { id } }); //update event data
    if (updatedEvent[0] === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

//delete an event by ID
app.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params; //get event ID from request params
    const deletedEvent = await Event.destroy({ where: { id } }); //delete event
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

//start server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});