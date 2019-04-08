'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    donation_uid: DataTypes.INTEGER,
    book_isbn: {
        type: DataTypes.STRING,
        // unique: true
    },
    book_id: DataTypes.INTEGER,
    donation_num: DataTypes.INTEGER
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
  };
  return Donation;
};
