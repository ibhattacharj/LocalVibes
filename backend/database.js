const { Sequelize, DataTypes } = require('sequelize'); //import necessary modules from sequelize package
const path = require('path'); 

//initialize sequelize with SQLite
const sequelize = new Sequelize({ 
  dialect: 'sqlite', //use SQLite database
  storage: './database.sqlite', //set location for SQLite database file
  logging: console.log //enable logging for debugging 
});

//authenticate connection to database
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//define Event model for event data
const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING, //event name
    allowNull: false, //required
  },
  description: {
    type: DataTypes.TEXT, //detailed description of event
    allowNull: false, //required
  },
  tags: {
    type: DataTypes.STRING, //tags for filtering and categorizing events
    allowNull: false, //tags must be provided
  },
  host: {
    type: DataTypes.STRING, //name of event host
    allowNull: false, //host is required
  },
  location: {
    type: DataTypes.STRING, //location where event will take place
    allowNull: false, //location is mandatory
  },
  lat: {
    type: DataTypes.FLOAT, //latitude for geolocation
    allowNull: true, //latitude is optional. Ideally location is there but this is slightly easier to debug as false
  },
  long: {
    type: DataTypes.FLOAT, //longitude for geolocation
    allowNull: true, //longitude is optional too
  },
  time: {
    type: DataTypes.DATE, //date and time of the event
    allowNull: false, //time is required
  },
  comments: {
    type: DataTypes.TEXT, //additional comments about event
    allowNull: true, //comments are optional
  },
  views: {
    type: DataTypes.INTEGER, //number of views for event
    defaultValue: 0, //default views set to zero
  },
  id: {
    type: DataTypes.INTEGER, //unique ID for event
    primaryKey: true, //marks this as primary key
    autoIncrement: true, //auto increments ID
  }
});

//define User model to store user info
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING, //unique username for the user
    allowNull: false, //must have a username
    unique: true, //ensure no duplicate usernames
  },
  name: {
    type: DataTypes.STRING, //full name of user
    allowNull: false, //name is required
  },
  email: {
    type: DataTypes.STRING, //email address of user
    allowNull: false, //email is mandatory
    unique: true, //every email must be unique
  },
  password: {
    type: DataTypes.STRING, //hashed password for user
    allowNull: false, //password is mandatory
  },
  user_id: {
    type: DataTypes.STRING, //unique ID for user
    primaryKey: true, //set as primary key
  },
  created_events: {
    type: DataTypes.STRING, //list of events created by user
    allowNull: true, //optional field
  },
  interested_events: {
    type: DataTypes.STRING, //list of events user is interested in
    allowNull: true, 
  },
  upcoming_events: {
    type: DataTypes.STRING, //list of upcoming events for user
    allowNull: true, 
  },
  past_events: {
    type: DataTypes.STRING, //list of past events user attended
    allowNull: true, 
  }
});

//create a sample dataset of events
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
  
//sample dataset of users
  const sampleUsers = [
    {
      username: 'jdoe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      created_events: 'Rock Fest 2024',
      interested_events: 'Jazz Night',
      upcoming_events: 'Electronic Beats',
      past_events: '',
    },
    {
      username: 'jsmith',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'mypassword',
      created_events: '',
      interested_events: 'Electronic Beats',
      upcoming_events: 'Jazz Night',
      past_events: 'Rock Fest 2024',
    }
  ];

//initialize and sync the database
(async () => {
  try {
    await sequelize.sync({ force: true }); //force sync to rebuild database
    console.log('Database & tables created');

    //check if events already exist before inserting
    const existingEvents = await Event.findAll();
    if (existingEvents.length === 0) {
      await Event.bulkCreate(sampleEvents); //insert sample events
      console.log('Sample events inserted');
    } else {
      console.log('Sample events already exist in the database. No insertion needed.');
    }

    const events = await Event.findAll(); //fetch all events
    console.log('Events fetched from the database:', JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error creating database and inserting sample data:', error);
  }
})();

module.exports = { sequelize, Event, User }; //export models and sequelize instance