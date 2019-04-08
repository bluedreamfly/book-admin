'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    employeeNo: {
        type: DataTypes.STRING,
        unique: true
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    passwd: DataTypes.STRING,
    role: DataTypes.INTEGER,
    avator: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
