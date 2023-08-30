const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const { productRouter } = require('./api/Routes/routes');
dotenv.config();

const app = express(); // initialize express app

app.use(express.json()); // parse requests of content-type - application/json

app.use(cors()); // enable cors
app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

app.use('/api/products', productRouter);
app.use('/users', productRouter);

app.use((err, req, res, next) => {
    res.json({
        error: err.message
        }) 
    })

// define a port
app.listen(8005, () => {
    console.log('Server is listening on port 8005');
});









