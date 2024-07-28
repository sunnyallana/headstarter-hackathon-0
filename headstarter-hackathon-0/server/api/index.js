const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// CORS configuration
const allowedOrigin = 'https://headstarter-hackathon-0-f.vercel.app';

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === allowedOrigin || !origin) {  // Allow requests with no origin (like from local development)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
  } else {
    next();
  }
});

const PORT = process.env.PORT || 5000;

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

// Fetch all events
app.get('/weeklydata', async (req, res) => {
  try {
    const result = await db.query('SELECT event_id, event_name, start_date, end_date, type FROM events');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetch a specific event by ID
app.get('/event/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events WHERE event_id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Event not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new event
app.post('/database/add', async (req, res) => {
  try {
    const { event_name, start_date, end_date, details, type, track } = req.body;
    await db.query(
      'INSERT INTO events (event_name, start_date, end_date, details, type, track) VALUES ($1, $2, $3, $4, $5, $6)',
      [event_name, start_date, end_date, details, type, track]
    );
    res.status(201).send('Event added');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an event by ID
app.delete('/database/delete', async (req, res) => {
  try {
    const { event_id } = req.body;
    const result = await db.query('DELETE FROM events WHERE event_id = $1', [event_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Event not found');
    }
    res.send('Event deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an existing event
app.put('/database/update', async (req, res) => {
  try {
    const { event_id, event_name, start_date, end_date, details, type, track } = req.body;
    const result = await db.query(
      'UPDATE events SET event_name = $1, start_date = $2, end_date = $3, details = $4, type = $5, track = $6 WHERE event_id = $7',
      [event_name, start_date, end_date, details, type, track, event_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Event not found');
    }
    res.send('Event updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});