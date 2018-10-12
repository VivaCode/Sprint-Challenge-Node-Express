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
server.get('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    projects
    .get(id)
    .then(project => {
        if(!project) {
            res.status(404).json({message: 'No Project with this ID exists'})
        } else {
            res.status(200).send(project);
        }
    })
    .catch(err => {
        res.status(500).json({error: 'project can not be populated at this time'});
    });
});


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

//get actions by id
server.get('/api/actions/:id', (req, res) => {
    const id = req.params.id;
    actions
    .get(id)
    .then(action => {
        if(!action) {
            res.status(404).json({message: 'No Action with this ID exists'})
        } else {
            res.status(200).send(action);
        }
    })
    .catch(err => {
        res.status(500).json({error: 'action can not be populated at this time'});
    });
});




server.listen(port, () => {
    console.log (`\n ******* Server Running on Port ${port} ********\n`)
})