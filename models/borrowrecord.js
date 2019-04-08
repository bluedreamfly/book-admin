'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowRecord = sequelize.define('BorrowRecord', {
    user_id: DataTypes.INTEGER,
    book_isbn: DataTypes.STRING,
    borrow_time: DataTypes.INTEGER,
    borrow_status: DataTypes.INTEGER,
    give_back_time: DataTypes.DATE
  }, {});
  BorrowRecord.associate = function(models) {
    // associations can be defined here
  };
  return BorrowRecord;
};
