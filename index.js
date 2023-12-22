const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();

console.log(`Trying to start server on : ${process.env.PORT}`);

app.use(morgan('tiny'));
app.use(express.static('./public'));
app.use(express.json())

app.get('/color', async (req, res) => {
  res.send({
    color: process.env.BGCOLOR
  })
});

app.get('*', async (req, res) => {
  res.send({
    path: req.url,
    color: process.env.BGCOLOR
  })
});

app.post('*', async (req, res) => {
  console.log(req.body);

  res.send({
    path: req.url,
    color: process.env.BGCOLOR,
    ...req.body
  })
});



app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + process.env.PORT);
});
