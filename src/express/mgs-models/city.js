const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'City Name is required!'],
    trim: true,
    validate: {
      validator: (v) => {
        const firstLetter = v[0];
        return firstLetter.toUpperCase() === firstLetter;
      },
      message: 'City Name must start with a capital letter!'
    }
  },
  country: { type: String, trim: true, required: [true, 'Country is required!'] },
  capital: { type: Boolean, trim: true, default: false },
  lastModifiedDate: Date,
  location: {
    lat: Number,
    long: Number
  }
});

CitySchema.pre('save', function(next) {
  this.lastModifiedDate = Date.now();
  next();
});

const CityModel = mongoose.model('City', CitySchema);
module.exports = CityModel;
