'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    employeeNo: { //员工编号
        type: DataTypes.STRING,
        unique: true
    },
    name: DataTypes.STRING, //员工姓名
    phone: DataTypes.STRING, //员工电话
    passwd: DataTypes.STRING, //员工密码
    role: DataTypes.INTEGER, //员工角色
    avator: DataTypes.STRING //员工头像
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
