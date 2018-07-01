const mongoose = require('mongoose');
const CityModel = require('../models/City'); 
const url = 'mongodb://localhost:27017';
const dbName = 'task7';
mongoose.connect(`${url}/${dbName}`);

const getRandomCity = (callback) => {
  CityModel.find({}, (err, allCitiesArray) => {
    const randomIndex = Math.floor(Math.random() * allCitiesArray.length);
    callback(allCitiesArray[randomIndex]);
  });
};

require('http')
  .createServer()
  .on('request', (req, res) => {
    try {
      getRandomCity((result) => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(result));
      });
    } catch (err) {
      console.log(err.message);
      res.statusCode = 500;
      res.statusMessage = 'Server error occurred';
      res.end('An error occurred. Please, try later');
    }
  })
  .listen(3000);
