const express = require('express');
const router = express.Router();
const http = require('http');
const { randomUUID } = require('crypto');

let loads = [];

router.post('/', async (req, res) => {
    const { destination, nbRequest, duration } = req.body;

    const load = {
        id: randomUUID(),
        destination: destination,
        nbRequest: nbRequest,
        duration: duration
    }

    createLoadTest(destination, nbRequest, duration);

    loads.push(load);
    res.send(load);
});


router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const index = loads.findIndex(load => load.id === id);

    if (index == -1) {
        res.status(404).send();
        return;
    }

    loads.splice(index, 1);
    res.status(204).send();
});


router.get('/health', async (req, res) => {
    res.send({
        status: 'UP'
    })
});


const createLoadTest = (destination, nbRequest, duration) => {
    const intervalPerSecond = 1/nbRequest;

    const interval = setInterval(() => {
        http.get(`http://${destination}/load/health`, (res) => {
            console.log(res.statusCode);
        }, intervalPerSecond);
    });

    setTimeout(() => {
        clearInterval(interval);
    }, duration * 1000);

};



module.exports = router;