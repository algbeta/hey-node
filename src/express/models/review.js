'use strict';
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define('Review', {
    productId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};