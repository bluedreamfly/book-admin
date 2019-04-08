'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    user_id: DataTypes.INTEGER,
    book_isbn: DataTypes.STRING,
    replay_uid: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    conent: DataTypes.STRING
  }, {});
  comment.associate = function(models) {
    //   let User = models.user;
    //   let Comment = models.comment;
    //   Comment.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', as: 'user'});
    //   console.log('lallalagggggg', models);
    // associations can be defined here
  };
  return comment;
};
