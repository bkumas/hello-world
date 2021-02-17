const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');
let fs = require('fs');

//users - Esra

app.get('/users', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id))
    if (!user) res.status(404).send("ID of User is not found");
    res.send(user)
});

app.post('/users', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    //validate
    const schema = Joi.object({
        "username": Joi.string().min(3).required(),
        "age": Joi.number().required().greater(16).less(40),
        "interests": Joi.array().min(5).max(15).required()
    });
    
     const schema_result = schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }
    
        let presentUser = 0;
    for (let u in users) {
        if(presentUser < users[u].id)
        presentUser = users[u].id;
    }

        //create
    const newUser = {
        "id": `${parseInt(presentUser) + 1}`,
        "username": req.body.username,
        "age": req.body.age,
        "status": "online",
        "interests": req.body.interests,
    };
    
        users.push(newUser);
    rewriteFile("users.json", users);

    res.location(`/users/${parseInt(presentUser) + 1}`);
    res.send(newUser);
});

app.put('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of user is not found");
    
        //validate
    const schema = Joi.object({
        "username": Joi.string().min(3),
        "age": Joi.number(),
        "status" : Joi.string().valid("online", "offline"),
        "interests": Joi.array().min(5).max(15),
    });
    
    const schema_result= schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }    

        //update
    if (req.body.username) user.username = req.body.username;
    if (req.body.age) user.age = req.body.age;
    if (req.body.interests) user.interests = req.body.interests;
    if(req.body.status) user.status = req.body.status;
    
        rewriteFile("users.json", users);
    res.send(user);
})

app.delete('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of User is not found");
    
    //delete user
    const index = users.indexOf(user);
    users.splice(index, 1);
    
        rewriteFile("users.json", users);
    res.send(user);
});
  
//missions - Beyza

app.get('/missions', (req, res) => {
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    res.send(missions);
});

app.get('/missions/:id', (req, res) => {
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const mission = missions.find(r => parseInt(r.id) === parseInt(req.params.id));
    if (!mission) res.status(404).send("Mission with such ID does not exist.");
    res.send(mission);
});

app.post('/missions', (req, res) => {

    //validate
    const schema = Joi.object({
        "userID": Joi.string().required(),
    });
    const schema_result= schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }

    const fs = require('fs');
    const datamuse = require('datamuse');

    let users = JSON.parse(fs.readFileSync('users.json'));
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.body.userID));
    if (!user) res.status(404).send("ID of User is not found");

    //should change
    let presentMission = 0;
    for (let m in missions) {
        if(presentMission < missions[m].id)
        presentMission = missions[m].id;
        
        
//rooms - Achelia
//results - Achelia
