const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration to allow only specific origin
const corsOptions = {
  origin: 'https://headstarter-hackathon-0-f.vercel.app',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;  // Default to port 4000 if PORT is not set

// Updated sample data for events
let sampleEvents = [
  {
    "event_id": 2,
    "event_name": "Pathways to Tech Event",
    "start_date": "2024-07-25T07:00:00Z",
    "end_date": "2024-07-25T12:00:00Z",
    "details": "Tech event",
    "type": "ONLINE EVENT",
    "track": "General"
  },
  {
    "event_id": 3,
    "event_name": "Team Meetup",
    "start_date": "2024-07-24T20:00:00Z",
    "end_date": "2024-07-26T23:59:00Z",
    "details": "Team gathering",
    "type": "IN-PERSON EVENT",
    "track": "General"
  },
  {
    "event_id": 4,
    "event_name": "Share Insights on LinkedIn",
    "start_date": "2024-07-25T22:30:00Z",
    "end_date": "2024-07-26T23:59:00Z",
    "details": "Share professional insights on LinkedIn related to session held by HeadStarter AI",
    "type": "NETWORKING",
    "track": "General"
  },
  {
    "event_id": 5,
    "event_name": "Hackathon",
    "start_date": "2024-07-26T20:00:00Z",
    "end_date": "2024-07-28T09:00:00Z",
    "details": "Build a project and record its analytics and try to get users",
    "type": "HACKATHON",
    "track": "General"
  },
  {
    "event_id": 6,
    "event_name": "Give Project Feedback",
    "start_date": "2024-07-27T15:00:00Z",
    "end_date": "2024-07-28T23:59:00Z",
    "details": "Feedback session",
    "type": "NETWORKING",
    "track": "General"
  },
  {
    "event_id": 7,
    "event_name": "Meetup with Fellows",
    "start_date": "2024-07-28T12:00:00Z",
    "end_date": "2024-07-28T23:59:00Z",
    "details": "Meet and greet",
    "type": "IN-PERSON EVENT",
    "track": "General"
  },
  {
    "event_id": 8,
    "event_name": "Project 1: Personal Website",
    "start_date": "2024-07-22T00:00:00Z",
    "end_date": "2024-07-26T19:00:00Z",
    "details": "Create a portfolio website using HTML and CSS.",
    "type": "PROJECT",
    "track": "General"
  },
  {
    "event_id": 9,
    "event_name": "Reach Out to Engineers",
    "start_date": "2024-07-22T00:00:00Z",
    "end_date": "2024-07-24T23:59:00Z",
    "details": "Networking with engineers",
    "type": "NETWORKING",
    "track": "General"
  },
  {
    "event_id": 10,
    "event_name": "Interview",
    "start_date": "2024-07-24T19:30:00Z",
    "end_date": "2024-07-24T22:59:00Z",
    "details": "Mock interview",
    "type": "MOCK INTERVIEW",
    "track": "General"
  }
];

// Commented out database connection code
/*
const db = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

db.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});
*/

// Fetch all events
app.get('/weeklydata', (req, res) => {
  try {
    res.json(sampleEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetch a specific event by ID
app.get('/event/:id', (req, res) => {
  try {
    const event = sampleEvents.find(event => event.event_id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).send('Event not found');
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new event
app.post('/database/add', (req, res) => {
  try {
    const { event_name, start_date, end_date, details, type, track } = req.body;
    const newEvent = {
      event_id: sampleEvents.length + 1,
      event_name,
      start_date,
      end_date,
      details,
      type,
      track
    };
    sampleEvents.push(newEvent);
    res.status(201).send('Event added');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an event by ID
app.delete('/database/delete', (req, res) => {
  try {
    const { event_id } = req.body;
    const initialLength = sampleEvents.length;
    sampleEvents = sampleEvents.filter(event => event.event_id !== event_id);
    if (sampleEvents.length === initialLength) {
      return res.status(404).send('Event not found');
    }
    res.send('Event deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an existing event
app.put('/database/update', (req, res) => {
  try {
    const { event_id, event_name, start_date, end_date, details, type, track } = req.body;
    const eventIndex = sampleEvents.findIndex(event => event.event_id === event_id);
    if (eventIndex === -1) {
      return res.status(404).send('Event not found');
    }
    sampleEvents[eventIndex] = { event_id, event_name, start_date, end_date, details, type, track };
    res.send('Event updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
