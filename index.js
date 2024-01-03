const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();
const COLOR = process.env.COLOR || "red";
const PORT = process.env.PORT || 3000;

console.log(`Trying to start server on : ${PORT}`);

app.use(morgan('tiny'));
app.use(express.static('./public'));
app.use(express.json())

app.get('/color', async (req, res) => {
  res.send({
    color: COLOR
  })
});

app.get('*', async (req, res) => {
  res.send({
    path: req.url,
    color: COLOR
  })
});

app.post('*', async (req, res) => {
  console.log(req.body);

  res.send({
    path: req.url,
    color: COLOR,
    ...req.body
  })
});

app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + PORT);
});
