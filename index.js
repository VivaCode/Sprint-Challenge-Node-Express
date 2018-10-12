const express = require("express");

const server = express();
const port = 9000;

server.use(express.json());

const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');

// ** Project Routes **

//get all projects
server.get('/api/projects', (req, res) => {
    projects
    .get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        res.status(500).json({message: 'No Projects Found'});
    });
});

//get projects by id



// ** Action Routes **

//get all actions
server.get('/api/actions', (req, res) => {
    actions
    .get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({message: 'No Actions Found'});
    });
});




server.listen(port, () => {
    console.log (`\n ******* Server Running on Port ${port} ********\n`)
})