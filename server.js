const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
let projectData = {};

/* Middleware */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

/* Init main folder */
app.use(express.static('static'));

/* Init port listener */
app.listen(port, () => {console.log(`Server is running on port ${port}`)});

app.post('/adding', myAdding);
let counter = 1;

function myAdding(req, res){
    projectData[counter] = req.body
    counter++;
}

app.get('/all', (req, res) => {
    res.send(projectData);
})