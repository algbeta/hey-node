const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    name: String,
    required: [true, 'Product name is required!'],
    trim: true
  },
  type: {
    type: String,
    trim: true,
    required: [true, 'Product type is required!']
  }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
