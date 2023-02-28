const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();
const PORT = process.env.port || 8080;
const BGCOLOR = process.env.bgcolor;

console.log(PORT);

app.use(morgan('tiny'));
app.use(express.static('./public'));


app.get('/color', (req, res) => {
  res.send({
    color: BGCOLOR,
    env: `prod`
  })
});

app.listen(PORT, () => {
  console.log('server running on port : ' + PORT);
});
