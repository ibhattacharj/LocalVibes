//import express from 'express';
//import { Sequelize } from 'sequelize';
//import { Event, User } from './database.js';

const { Event, sequelize, User } = require('./database.js');
const express = require('express')
const cors = require('cors');

const { Sequelize } = require('sequelize');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

//JSON parse
app.use(express.json());

//CORS parse
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//popular events endpoint
app.get('/events/popular', async (req, res) => {
  console.log('Endpoint /events/popular called');
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

    const popularEvents = await Event.findAll();
    //  {
    //  order: [['views', 'DESC']],
    //  limit: 10,
    //});

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
      const events = await Event.findAll(); //for now returns all events
      
      //must implement filtering logic to determine user preferences here. Will likely filter based on user tags and/or past events
      
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching personalized events:', error);
      res.status(500).json({ error: 'Failed to retrieve personalized events' });
    }
  });

//nearby events endpoint (demo purposes)
app.get('/events/nearby', async (req, res) => {
  const userLocation = req.query.location; //expects location as query parameter
  if (!userLocation) {
    return res.status(400).json({ error: 'User location required' });
  }
  try {
    //for demo, return all events; actual implementation will need Adrien's goelocation data
    const nearbyEvents = await Event.findAll({ limit: 10 });
    res.status(200).json(nearbyEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby events' });
  }
});

//search events endpoint
app.get('/events/search', async (req, res) => {
  const { query, genre, location } = req.query;
  try {
    const searchResults = await Event.findAll({
      where: {
        name: query ? { [Sequelize.Op.like]: `%${query}%` } : undefined,
        tags: genre ? { [Sequelize.Op.like]: `%${genre}%` } : undefined,
        location: location ? { [Sequelize.Op.like]: `%${location}%` } : undefined,
      },
    });
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search events' });
  }
});

//new event endpoint
app.post('/events', async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

//endpoint to update an event
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.update(req.body, { where: { id } });
    if (updatedEvent[0] === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

//endpoint to delete an event
app.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.destroy({ where: { id } });
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});