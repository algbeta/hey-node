const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required!'],
    trim: true
  },
  type: {
    type: String,
    trim: true,
    required: [true, 'Product type is required!']
  },
  lastModifiedDate: Date
});

ProductSchema.pre('save', function(next) {
  this.lastModifiedDate = Date.now();
  next();
});


const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
