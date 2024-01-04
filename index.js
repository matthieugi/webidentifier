const express = require('express');
const app = express();
const morgan = require('morgan');
const { randomUUID } = require('crypto');

const COLOR = process.env.BGCOLOR || "blue";
const PORT = process.env.PORT || 3000;

console.log(`Trying to start server on : ${PORT}`);
console.log(`Color is : ${COLOR}`);

let policyIds = [];

app.use(morgan('tiny'));
app.use(express.static('./public'));
app.use(express.json())

app.get('/color', async (req, res) => {
  res.send({
    color: COLOR
  })
});

app.get('/policy/:id', async (req, res) => {
  const id = req.params.id;

  if (policyIds.includes(id)) {
    res.send({
      id: id,
      path: req.url,
      color: COLOR
    })
  } else {
    res.status(404).send({
      id: id,
      path: req.url,
      color: COLOR,
      error: "Not Found"
    })
  }
});

app.post('/policy', async (req, res) => {
  const id = randomUUID();
  policyIds.push(id);


  res.send({
    id: id,
    path: req.url,
    color: COLOR,
    ...req.body
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
