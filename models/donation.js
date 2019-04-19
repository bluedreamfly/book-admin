'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    donation_uid: DataTypes.INTEGER, //捐赠用户ID
    book_isbn: { //图书条形码
        type: DataTypes.STRING,
        // unique: true
    },
    book_id: DataTypes.INTEGER, //图书ID
    donation_num: DataTypes.INTEGER //捐赠数量
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
  };
  return Donation;
};
