const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'task7';
let db = null;

MongoClient.connect(
  url,
  (err, client) => {
    if (!err) {
      db = client.db(dbName);
    }
  }
);

const getRandomCity = (callback) => {
  if (!db) {
    return {};
  }

  const cities = db.collection('cities');
  if (!cities) {
    return {};
  }

  cities.find({}).toArray().then((allCitiesArray) => {
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
      res.statusCode = 500;
      res.statusMessage = 'Server error occurred';
      res.end();
    }
  })
  .listen(3000);
