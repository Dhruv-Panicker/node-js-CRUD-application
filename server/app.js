const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const dbService = require('./dbservice');
const { request, response } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));



// create 
app.post('/insert', (request, response) => {
    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err));

});



// read

app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    result.then(data => response.json({data: data})).catch(err => console.log(err));

});


//update
app.patch('/update', (request, response) => {
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();

    
    const result = db.updateNameById(id, name);

    result.then(data => response.json({success: data})).catch(err => console.log(err));

});

//delete
//Get the id of the item that is waning to be deleted from the URL 
app.delete('/delete/:id', (request, response) => {
    const {id} = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);

    result.then(data => response.json({success: data})).catch(err => console.log(err));

});

//Search
app.get('/search/:name', (request, response) => {
    const {name} = request.params;

    const db = dbService.getDbServiceInstance();

    
    const result = db.searchByName(name);
    result.then(data => response.json({data: data})).catch(err => console.log(err));
});



app.listen(process.env.PORT, () => console.log('app is running'));