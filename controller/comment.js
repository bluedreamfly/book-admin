const models = require('../models/index');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;
const Comment = models.comment;
// const Book = models.book;
// const Donation = models.donation;
// const BorrowRecord = models.borrowrecord;
const User = models.user;


// let BUser = BorrowRecord.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', as: 'user'});
// let BBook = BorrowRecord.belongsTo(Book, {foreignKey: 'book_isbn', targetKey: 'ISBN', as: 'book'});
let CUser = Comment.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', as: 'user'});
let ReplayUser = Comment.belongsTo(User, {foreignKey: 'replay_uid', targetKey: 'id', as: 'replay_user'});
// let DBook = Donation.belongsTo(Book, {foreignKey: 'book_isbn', targetKey: 'ISBN', as: 'book'})



let CComment = Comment.hasMany(Comment, {foreignKey: 'parent_id', targetKey: 'id', as: 'children'});

module.exports = {
    'POST /comment/add': async (ctx, next) => {
        // const {book_isbn, replay_uid, parent_id, content} = ctx.request.body;
        try {
            let comment = await Comment.create({...ctx.request.body, user_id: ctx.uid});
            ctx.body = {
                code: 200,
                data: comment,
                msg: ''
            }
        } catch(e) {
            ctx.body = {
                code: '10001',
                data: null,
                msg: e.message || '服务器异常'
            }
        }
    },

    'GET /comment/list': async (ctx, next) => {
        let isbn = ctx.request.query;

        let list = await Comment.findAll({
            order: [
                ['createdAt', 'DESC'],
                [CComment, 'createdAt', 'ASC']
            ],
            include: [{
                association: CComment,
                include: [{
                    association: CUser,
                }, {
                    association: ReplayUser
                }]
            }, {
                association: CUser
            }, {
                association: ReplayUser
            }],
            where: {
                parent_id: null
            }
        })

        ctx.body = {
            code: 200,
            data: list,
            msg: ''
        }
    }
}
