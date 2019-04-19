'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    user_id: DataTypes.INTEGER, //用户ID
    book_isbn: DataTypes.STRING, //书本条形码
    replay_uid: DataTypes.INTEGER, //回复哪个用户的评论
    parent_id: DataTypes.INTEGER, //评论哪条评论
    conent: DataTypes.STRING //评论内容
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
