'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowRecord = sequelize.define('BorrowRecord', {
    user_id: DataTypes.INTEGER, //用户id
    book_isbn: DataTypes.STRING, //书本条形码
    borrow_time: DataTypes.INTEGER,  //借阅次数
    borrow_status: DataTypes.INTEGER, //借阅状态
    give_back_time: DataTypes.DATE //归还时间
  }, {});
  BorrowRecord.associate = function(models) {
    // associations can be defined here
  };
  return BorrowRecord;
};
