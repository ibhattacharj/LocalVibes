const { Sequelize, DataTypes } = require('sequelize');
const path = require("path");

const sequelize = new Sequelize({ // initialize sequelize with SQLite
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log 
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//event model
const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  host: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
});

//user model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  created_events: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interested_events: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  upcoming_events: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  past_events: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Review model
const Review = sequelize.define("Review", {
  review_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  event_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// sample events to test posting to db
const sampleEvents = [
    {
      name: 'Rock Fest 2024',
      description: 'A celebration of rock music featuring various artists.',
      host: 'Rock Society',
      location: 'Central Park',
      lat: 42.388211,
      long: -72.530537,
      tags: 'Rock, Live, Music',
      time: new Date('2024-06-10T19:00:00'),
      comments: 'Join us for an unforgettable evening!',
      views: 250,
    },
    {
      name: 'Jazz Night',
      description: 'Smooth jazz performances by renowned artists.',
      host: 'Jazz Enthusiasts',
      location: 'Downtown Club',
      lat: 42.38749,
      long: -72.529582,
      tags: 'Jazz, Live, Nightlife',
      time: new Date('2024-07-15T21:00:00'),
      comments: 'A perfect night for jazz lovers.',
      views: 150,
    },
    {
      name: 'Electronic Beats',
      description: 'An electrifying night of electronic dance music.',
      host: 'EDM Collective',
      location: 'Skyline Arena',
      lat: 42.389257,
      long: -72.522511,
      tags: 'EDM, Party, Dance',
      time: new Date('2024-08-20T22:00:00'),
      comments: 'Feel the beat and dance all night!',
      views: 300,
    },
    {
      name: 'Rock the Night',
      description: 'An electrifying rock concert featuring local bands.',
      host: 'Rock Legends',
      location: 'Mountain View Amphitheater',
      lat: 42.381200,
      long: -72.532300,
      tags: 'Rock, Live, Music',
      time: new Date('2024-06-14T20:00:00'),
      comments: 'Feel the adrenaline rush!',
      views: 350,
    },
    {
      name: 'Smooth Jazz Evening',
      description: 'Experience the smooth sounds of jazz under the stars.',
      host: 'Jazz Ensemble',
      location: 'Downtown Jazz Park',
      lat: 42.383400,
      long: -72.528900,
      tags: 'Jazz, Live, Music',
      time: new Date('2024-07-22T19:00:00'),
      comments: 'A night to remember for jazz lovers.',
      views: 200,
    },
    {
      name: 'Electronic Pulse',
      description: 'The ultimate EDM experience with top DJs.',
      host: 'Pulse Events',
      location: 'Skyline Club',
      lat: 42.387800,
      long: -72.524700,
      tags: 'Electronic, EDM, Dance',
      time: new Date('2024-08-15T22:00:00'),
      comments: 'Dance the night away!',
      views: 450,
    },
    {
      name: 'Acoustic Vibes',
      description: 'Relax with soothing acoustic performances.',
      host: 'Acoustic Sounds',
      location: 'Riverside Cafe',
      lat: 42.385500,
      long: -72.529100,
      tags: 'Acoustic, Live, Chill',
      time: new Date('2024-09-10T18:00:00'),
      comments: 'Perfect for a laid-back evening.',
      views: 150,
    },
    {
      name: 'Pop Fiesta',
      description: 'A night of chart-topping hits and fun!',
      host: 'Pop Stars Collective',
      location: 'Mega Dome',
      lat: 42.389600,
      long: -72.522400,
      tags: 'Pop, Concert, Party',
      time: new Date('2024-07-28T20:00:00'),
      comments: 'Get ready for a pop-tastic experience!',
      views: 500,
    },
    {
      name: 'Classical Legends',
      description: 'Enjoy timeless pieces performed by renowned orchestras.',
      host: 'Symphony Hall',
      location: 'City Opera House',
      lat: 42.383800,
      long: -72.530600,
      tags: 'Classical, Orchestra, Music',
      time: new Date('2024-09-20T19:30:00'),
      comments: 'A treat for classical music lovers.',
      views: 300,
    },
    {
      name: 'Hip-Hop Showdown',
      description: 'The best hip-hop acts battle it out on stage.',
      host: 'Urban Rhythms',
      location: 'City Arena',
      lat: 42.386100,
      long: -72.526800,
      tags: 'Hip-Hop, Dance, Live',
      time: new Date('2024-08-05T20:00:00'),
      comments: 'A must-see for hip-hop fans!',
      views: 400,
    },
    {
      name: 'Country Fest',
      description: 'An outdoor festival celebrating country music.',
      host: 'Country Music Association',
      location: 'Greenfield Park',
      lat: 42.384900,
      long: -72.523200,
      tags: 'Country, Acoustic, Outdoors',
      time: new Date('2024-10-01T15:00:00'),
      comments: 'Bring your boots and hats!',
      views: 275,
    },
    {
      name: 'Pop & Rock Mashup',
      description: 'A unique blend of pop and rock hits.',
      host: 'Fusion Events',
      location: 'Rooftop Stage',
      lat: 42.387200,
      long: -72.524300,
      tags: 'Pop, Rock, Live',
      time: new Date('2024-08-30T19:00:00'),
      comments: 'The best of both worlds!',
      views: 380,
    },
    {
      name: 'Classical Piano Recital',
      description: 'A breathtaking performance by a world-class pianist.',
      host: 'Classical Arts Foundation',
      location: 'Concert Hall',
      lat: 42.385000,
      long: -72.529000,
      tags: 'Classical, Piano, Music',
      time: new Date('2024-09-15T18:00:00'),
      comments: 'A night of elegance and artistry.',
      views: 260,
    },
];
  
  const sampleUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      created_events: 'Rock Fest 2024',
      interested_events: 'Jazz Night',
      upcoming_events: 'Electronic Beats',
      past_events: '',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'mypassword',
      created_events: '',
      interested_events: 'Electronic Beats',
      upcoming_events: 'Jazz Night',
      past_events: 'Rock Fest 2024',
    }
  ];

//This code is used to sync the Sequelize models with the database (by dropping and recreating 
// tables), insert sample event data, and fetch and log those events from the database. 
// It's mainly used for testing or setting up initial data for development purposes.
(async () => {
  try {
    //Changed to force: false, so the database won't recreate itself every time
    await sequelize.sync({ force: false });
    console.log('Database & tables created');

    await Event.bulkCreate(sampleEvents); //TEMPORARY TO INSERT SAMPLE EVENTS
    console.log('Sample events inserted');

    const events = await Event.findAll(); // to see what events are in db
    console.log('Events fetched from the database:', JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error creating database and inserting sample data:', error);
  }
})();

module.exports = { sequelize, Event, User, Review };