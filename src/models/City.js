const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'City Name is required!'],
    validate: {
      validator: (v) => {
        const firstLetter = v[0];
        return firstLetter.toUpperCase() === firstLetter;
      },
      message: 'City Name must start with a capital letter!'
    }
  },
  country: { type: String, required: [true, 'Country is required!'] },
  capital: { type: Boolean, default: false },
  location: {
    lat: Number,
    long: Number
  }
});

const CityModel = mongoose.model('City', CitySchema);
module.exports = CityModel;
