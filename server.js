require('dotenv').config();
const express = require('express');
const apps = express();
const bodyParser = require('body-parser')
const port = process.env.PORT;
const path = require('path');

apps.use(bodyParser.json())
apps.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

apps.use(express.static('public'));

apps.get('/', (req, res) => {
    res.sendFile(path.resolve('./views/index.html'));
})

apps.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve('./views/dashboard.html'));
})

apps.get('/detail/:id', (req, res) => {
    res.sendFile(path.resolve('./views/detail.html'));
    // const idTx = req.params.id;
})


apps.listen(port);