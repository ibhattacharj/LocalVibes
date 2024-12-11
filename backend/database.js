const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Event model
const Event = sequelize.define("Event", {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // required in form
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // required in form
  },
  host: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false, // required in form
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true, // not in form
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: true, // not in form
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false, // required in form
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false, // required in form
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true, // optional
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // optional in form
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

// User model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
});

// Sample events for testing
const sampleEvents = [
  {
    name: "Rock Fest 2024",
    description: "A celebration of rock music featuring various artists.",
    host: "Rock Society",
    location: "Central Park",
    lat: 42.388211,
    long: -72.530537,
    tags: "Rock, Live, Music",
    time: new Date("2024-06-10T19:00:00"),
    comments: "Join us for an unforgettable evening!",
    views: 250,
  },
  {
    name: "Jazz Night",
    description: "Smooth jazz performances by renowned artists.",
    host: "Jazz Enthusiasts",
    location: "Downtown Club",
    lat: 42.38749,
    long: -72.529582,
    tags: "Jazz, Live, Nightlife",
    time: new Date("2024-07-15T21:00:00"),
    comments: "A perfect night for jazz lovers.",
    views: 150,
  },
  {
    name: "Electronic Beats",
    description: "An electrifying night of electronic dance music.",
    host: "EDM Collective",
    location: "Skyline Arena",
    lat: 42.389257,
    long: -72.522511,
    tags: "EDM, Party, Dance",
    time: new Date("2024-08-20T22:00:00"),
    comments: "Feel the beat and dance all night!",
    views: 300,
  },
];

// Sample users for testing
const sampleUsers = [
  {
    username: "jdoe",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    created_events: "Rock Fest 2024",
    interested_events: "Jazz Night",
    upcoming_events: "Electronic Beats",
    past_events: "",
  },
  {
    username: "jsmith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "mypassword",
    created_events: "",
    interested_events: "Electronic Beats",
    upcoming_events: "Jazz Night",
    past_events: "Rock Fest 2024",
  },
];

// Sync database and insert sample data
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database & tables created");

    const existingEvents = await Event.findAll();
    if (existingEvents.length === 0) {
      await Event.bulkCreate(sampleEvents); // Insert sample events
      console.log("Sample events inserted");
    } else {
      console.log("Sample events already exist in the database.");
    }

    await User.bulkCreate(sampleUsers); // Insert sample users
    console.log("Sample users inserted");

    const events = await Event.findAll();
    console.log(
      "Events fetched from the database:",
      JSON.stringify(events, null, 2)
    );
  } catch (error) {
    console.error("Error creating database and inserting sample data:", error);
  }
})();

module.exports = { sequelize, Event, User };
