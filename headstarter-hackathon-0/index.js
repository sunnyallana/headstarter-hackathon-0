import express from 'express';
import pg from 'pg';
import env from 'dotenv';
import cors from 'cors';
import fs from 'fs';

const app = express();
env.config();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT;


const db =  new pg.Client({
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

//time is in est
app.get('/weeklydata', async (req, res) => {
  try {
    // Query to get events from the database
    const result = await db.query('SELECT event_id, event_name, start_date, end_date, type FROM events');
    const events = result.rows;
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get("/event/:id" , async (req,res) =>{
 try{
  console.log(req.params.id);
  let result = await db.query('SELECT * FROM events WHERE event_id = $1', [req.params.id]);
   result= result.rows;
  res.json(result);
 }
 catch(err){
   console.error(err.message);
    res.status(500).send('Server Error');
 }
 
});

//to add events in database
app.get("/database/add" , async (req,res) => {
  try{
    const {event_name, start_date, end_date,details, type , track} = req.body;
    
     // date format 2021-07-01 00:00:00
    const result = await  db.query("INSERT INTO events (event_name, start_date, end_date,details, type,track) VALUES ($1, $2, $3, $4,$5,$6)", [event_name, start_date, end_date,details, type , track]);
    res.send("Event added");
    if (result.rows.length === 0) {
      res.status(409).send('Duplicate event entry');
    } else {
      res.status(201).send('Event added');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});
//to delete events in database
app.get("/database/delete" , async (req,res) => {
  try{
    const {event_id} = req.body;
    const result = await db.query("DELETE FROM events WHERE event_id = $1", [event_id]);
    res.send("Event deleted");
  }
  catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});
//to update events in database
app.get("/database/update" , async (req,res) => {
  try{
    const {event_id, event_name, start_date, end_date,details, type , track} = req.body;
    const result  = await db.query("UPDATE events SET event_name = $1, start_date = $2, end_date = $3, details = $4, type = $5, track = $6 WHERE event_id = $7", [event_name, start_date, end_date,details, type , track, event_id]);
    res.send("Event updated");
  }
  catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
