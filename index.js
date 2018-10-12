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

//create new project
server.post('/api/projects/', (req, res) => {
    const projectModel = req.body;
    projects
        .insert(projectModel)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            if (err.errno === 19) {
                res.status(404).json({message: 'please provide all required fields'});
            } else {
                res.status(500).json({message: 'Not able to create new project at this time'});
            }
        });
});

//update project *** come back to check error handling
server.put('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    projects
        .update(id, update)
        .then(count => {
            if (count > 0) {
            projects.get(id).then(projects => {
                res.status(200).json(projects);
            })
            } else {
                res.status(400).json({message: 'Project not found: cannot update.'});   
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Server cannot update project at this time.'});
        });
   });

//delete project
server.delete('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    projects
        .remove(id)
        .then(response => {
            res.status(200).json({message: 'project deleted' })
        })
        
        .catch(err => {
            res.status(500).json({message: 'unable to remove project from server'});
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

//get actions by project id
server.get('/api/projects/:id/actions/', (req, res) => {
    const id = req.params.id;
    projects
    .getProjectActions(id)
    .then(actions => {
        if(!actions) {
            res.status(404).json({message:'no actions found for this project'});
        } else {
            res.status(200).send(actions);
        }
    })
    .catch(err => {
        res.status(500).json({message:'actions cannot be populated at this time.'});
    });
});

//create new action
server.post('/api/actions', (req, res) => {
    const newAction = {
        "project_id": req.body.project_id,
        "description": req.body.description,
        "notes": req.body.notes
    }

    if (!newAction.description || !newAction.notes || !newAction.project_id) {
        return res.status(400).json({msg: 'please provide all required fields'});
    }
    actions
        .insert(newAction)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json({message: 'Not able to create new action at this time'});
        });
});

//update action by id *** come back to check error handling
server.put('/api/actions/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    actions
        .update(id, update)
        .then(count => {
            if (count > 0) {
                actions.get(id).then(action => {
                    res.status(200).json(action)
                })
            } else {
                res.status(400).json({message: 'Action not found: cannot update.'});   
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Server cannot update project at this time.'});
        });
})


//delete action
server.delete('/api/actions/:id', (req, res) => {
    const id = req.params.id;

    actions
        .get(id)
        .then(action => {
            actions
            .remove(id)
            .then(action => {
                res.status(200).json({message: 'action has been deleted'})
            })
            .catch(err => {
                res.status(500).json(err)
            });
        })
        .catch(err => {
            res.status(404).json({message: 'action not found'});
        });
});




server.listen(port, () => {
    console.log (`\n ******* Server Running on Port ${port} ********\n`)
})