const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');

let policyIds = [];

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (policyIds.includes(id)) {
    res.send({
      id: id,
      path: req.url,
      color: process.env.BGCOLOR || "blue"
    })
  } else {
    res.status(404).send({
      id: id,
      path: req.url,
      color: process.env.BGCOLOR || "blue",
      error: "Not Found"
    })
  }
});

router.post('/', async (req, res) => {
  const id = randomUUID();
  policyIds.push(id);

  res.send({
    id: id,
    path: req.url,
    color: process.env.BGCOLOR || "blue",
    ...req.body
  })
});

module.exports = router;