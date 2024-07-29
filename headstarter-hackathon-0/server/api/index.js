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

// Sample data for events since the database has been disconnected
let sampleEvents = [
  {
    "event_id": 1,
    "event_name": "Tech Conference",
    "start_date": "2024-07-01T09:00:00Z",
    "end_date": "2024-07-01T17:00:00Z",
    "details": "A conference focusing on the latest in technology.",
    "type": "Conference",
    "track": "A",
    "speaker": "John Ross"
  },
  {
    "event_id": 2,
    "event_name": "Trend In SE Workshop",
    "start_date": "2024-07-02T10:00:00Z",
    "end_date": "2024-07-02T15:00:00Z",
    "details": "A hands-on workshop about trend in Software Engineering",
    "type": "Workshop",
    "track": "B",
    "speaker": "Andrew James"
  },
  {
    "event_id": 3,
    "event_name": "Freelancing",
    "start_date": "2024-07-03T13:00:00Z",
    "end_date": "2024-07-03T16:00:00Z",
    "details": "Seminar on Freelancing",
    "type": "Seminar",
    "track": "C",
    "speaker": "Mark Smith"
  }
]


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
