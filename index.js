const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('tiny'));

require('dotenv').config();

const { Pool } = require('pg');

const poolConfig = {
  connectionString: process.env.PG_CONNECTION_STRING
};

const pool = new Pool(poolConfig);

app.get('/color', async (req, res) => {

  const colors = await pool.query('SELECT name FROM colors');

  res.send(JSON.stringify(colors.rows));
});

app.get('/color/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const colors = await pool.query('SELECT name FROM colors WHERE name = $1', [name]);
    if (colors.rows.length === 0) {
      res.status(404).send('Not found');
      return;
    }
    res.status(200).send();
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
});


app.delete('/color/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const colors = await pool.query('DELETE FROM colors WHERE name = $1', [name]);
    if (colors.rowCount === 0) {
      res.status(404).send('Not found');
      return;
    }
    res.status(200).send();
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
});


app.post('/color', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send('Missing name');
    return
  }

  const name = req.query.name;
  try {
    await pool.query('INSERT INTO colors (name) VALUES ($1)', [name]);
    res.status(201).send('Created');
  }
  catch (err) {
    console.log(err);
  
    if(err.constraint === 'name_unique') {
      res.status(403).send('Color already exists');
      return;
    }

    res.status(500).send({ error: err.detail });
  }
});


console.log(`Trying to start server on : ${process.env.PORT}`);
app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + process.env.PORT);
});

process.on('exit', async () => {
  await pool.end();
});
