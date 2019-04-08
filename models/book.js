'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    ISBN: {
        type: DataTypes.STRING,
        unique: true
    }, //条形码
    name: DataTypes.STRING, //书名
    author: DataTypes.STRING, //作者
    press: DataTypes.STRING, //出版社
    picture: DataTypes.STRING, //书图片
    bigPicture: DataTypes.STRING,
    introduction: DataTypes.STRING(5000), //简介
    num: DataTypes.INTEGER, //总共有库存
    stock: DataTypes.INTEGER, //当前库存
    // borrowNum: DataTypes.INTEGER, //
    donationUid: DataTypes.INTEGER //捐赠者
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
