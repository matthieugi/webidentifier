const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();

console.log(`Trying to start server on : ${process.env.PORT}`);

app.use(morgan('tiny'));
app.use(express.static('./public'));

app.get('/color', async (req, res) => {
  res.send({
    color: process.env.BGCOLOR
  })
});

app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + process.env.PORT);
});
