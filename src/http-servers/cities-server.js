const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';
const dbName = 'task7';
mongoose.connect(`${url}/${dbName}`);

const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: String,
  country: String,
  capital: Boolean,
  location: {
    lat: Number,
    long: Number
  }
});

const CityModel = mongoose.model('City', CitySchema);

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
