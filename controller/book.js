// const User = require('../models/User');
const models = require("../models/index");
const dateUtil = require("../helper/date");
const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;
const Book = models.book;
const Donation = models.donation;
const BorrowRecord = models.borrowrecord;
const User = models.user;
const Comment = models.comment;

let BUser = BorrowRecord.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user"
});
let BBook = BorrowRecord.belongsTo(Book, {
  foreignKey: "book_isbn",
  targetKey: "ISBN",
  as: "book"
});
// let DBBorrow = Donation.hasMany(BorrowRecord, {foreignKey: 'book_isbn', targetKey: 'book_isbn'});
let BC = Book.hasMany(Comment, {foreignKey: 'book_isbn', sourceKey: 'ISBN'});
let DUser = Donation.belongsTo(User, {
  foreignKey: "donation_uid",
  targetKey: "id",
  as: "user"
});
let DBook = Donation.belongsTo(Book, {
  foreignKey: "book_isbn",
  targetKey: "ISBN",
  as: "book"
});

module.exports = {
    //新增图书
    "POST /book/add": async (ctx, next) => {
        const { isDonate, ...bookData } = ctx.request.body || {};
        const ISBN = bookData.ISBN;
        try {
            let book = await Book.findOne({
                where: {
                    ISBN: ISBN
                }
            });
            let newBook;
            if (book) {
                newBook = await Book.update(
                    {
                        ...book,
                        ...bookData,
                        stock: book.stock + 1,
                        num: book.num + 1
                    },
                    {
                        where: { ISBN: ISBN }
                    }
                );
            } else {
                newBook = await Book.create({
                    ...bookData,
                    stock: 1,
                    num: 1
                });
            }

            if (isDonate) {
                let condition = {
                    where: { donation_uid: ctx.uid, book_isbn: ISBN }
                };
                let donation = await Donation.findOne(condition);
                if (donation) {
                    await Donation.update(
                        {
                            ...donation,
                            donation_num: donation.donation_num + 1
                        },
                        condition
                    );
                } else {
                    await Donation.create({
                        donation_uid: ctx.uid,
                        book_isbn: ISBN,
                        donation_num: 1
                    });
                }
            }

            ctx.body = {
                code: "200",
                data: newBook.dataValues,
                msg: ""
            };
        } catch (e) {
            ctx.body = {
                code: "10001",
                data: null,
                msg: e.message || "服务器异常"
            };
        }
    },
    //借书或者还书
    "POST /book/op": async (ctx, next) => {
        let { ISBN, type } = ctx.request.body;
        try {
            let book = await Book.findOne({
                where: {
                    ISBN: ISBN
                }
            });
            if (!book) {
                ctx.body = {
                    code: "10010",
                    msg: "图书馆里没有这本书",
                    data: null
                };
                return;
            }

            let stock = book.stock;

            if (type == 1) {
                stock -= 1;
            } else if (type == 2) {
                stock += 1;
            }

            if (stock < 0) {
                ctx.body = {
                    code: "10011",
                    msg: "暂无可借图书",
                    data: null
                };
                return;
            }

            let borrowCon = {
                where: { user_id: ctx.uid, book_isbn: ISBN, borrow_status: 1 }
            };
            let record = await BorrowRecord.findOne(borrowCon);
            // console.log('sdfsdfsdfsdf', record);

            if (record) {
                if (type == 1 && record.borrow_status == 1) {
                    ctx.body = {
                        code: "10010",
                        msg: "你当前已借阅了这本书",
                        data: null
                    };
                    return;
                }
                if (type == 2) {
                    await BorrowRecord.update(
                        {
                            ...record,
                            give_back_time: new Date(),
                            borrow_status: 0
                        },
                        borrowCon
                    );
                }
            } else if (!record) {
                if (type == 2) {
                    ctx.body = {
                        code: "10010",
                        msg: "你未借过这本书",
                        data: null
                    };
                    return;
                } else {
                    await BorrowRecord.create({
                        user_id: ctx.uid,
                        book_isbn: ISBN,
                        borrow_status: 1
                    });
                }
            }

            await Book.update(
                { ...book, stock: stock },
                {
                    where: { ISBN: ISBN }
                }
            );
            ctx.body = {
                code: 200,
                data: null,
                msg: ""
            };
        } catch (err) {
            console.log(err);
            ctx.body = {
                code: "10001",
                data: null,
                msg: err.message || "服务器异常"
            };
        }
    },
    //借阅记录
    "GET /book/borrowRecord": async (ctx, next) => {
        let {
            page = 1,
            pageSize = 10,
            user_id,
            borrow_status = 1
        } = ctx.request.query;
        page = +page;
        pageSize = +pageSize;
        let condition = {
            borrow_status: borrow_status
        };
        if (user_id) {
            condition.user_id = user_id;
        }
        try {
            let list = await BorrowRecord.findAll({
                limit: pageSize,
                offset: (page - 1) * pageSize,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        association: BUser
                        // as: 'user2'
                    },
                    {
                        association: BBook
                        // as: 'book2'
                    }
                ],
                // group: 'book_isbn',
                where: condition
            });

            ctx.body = {
                code: 200,
                data: list,
                msg: ""
            };
        } catch (err) {
            console.log(err);
            ctx.body = {
                code: "10001",
                data: null,
                msg: err.message || "服务器异常"
            };
        }
    },

    //本月上新
    "GET /book/monthlist": async (ctx, next) => {
        let { page = 1, pageSize = 10 } = ctx.request.query;
        page = +page;
        pageSize = +pageSize;
        // console.log('page ...', page, pageSize, ctx.request.query);
        try {
            let newDate = new Date();
            let range = dateUtil.getDateRange(newDate);
            console.log(range);
            let list = await Donation.findAll({
                limit: pageSize,
                offset: (page - 1) * pageSize,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        association: DUser
                    },
                    {
                        association: DBook
                    }
                ],
                where: {
                    createdAt: {
                        [Op.lt]: range.end,
                        [Op.gt]: range.start
                    }
                }
            });

            ctx.body = {
                code: 200,
                data: list,
                msg: ""
            };
        } catch (err) {
            console.log(err);
            ctx.body = {
                code: "10001",
                data: null,
                msg: err.message || "服务器异常"
            };
        }
    },

    //图书详情
    "GET /book/detail/:isbn": async (ctx, next) => {
        let isbn = ctx.params.isbn;
        try {
            let book = await Book.findOne({
                // attributes: [[sequelize.fn('COUNT', sequelize.col('comments.book_isbn')), 'commentNum']],
                // group: ['comments.book_isbn'],
                include: [{
                    association: BC,
                    // attributes: ['book_isbn'],
                    // required: true,
                    // where: {}
                }],
                where: { ISBN: isbn }
            });
            ctx.body = {
                code: 200,
                data: book,
                msg: ""
            };
        } catch (err) {
            ctx.body = {
                code: "10001",
                data: null,
                msg: err.message || "服务器异常"
            };
        }
    },

    //捐赠列表
    "GET /book/donation/list": async (ctx, next) => {
        try {
            let list = await Donation.findAll({
                include: [
                    {
                        association: DBook
                    }
                ]
            });
            ctx.body = {
                code: 200,
                data: list,
                msg: ""
            };
        } catch (err) {
            console.log(err);
        }
    },

    //图书搜索
    "GET /book/search": async (ctx, next) => {
        let { keyword, page = 1, pageSize = 20 } = ctx.request.query;
        page = +page;
        pageSize = +pageSize;

        try {
            let list = await Book.findAll({
                limit: pageSize,
                offset: (page - 1) * pageSize,
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            press: {
                                [Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            author: {
                                [Op.like]: `%${keyword}%`
                            }
                        }
                    ]
                }
            });
            ctx.body = {
                code: 200,
                data: list,
                msg: ""
            };
        } catch (err) {
            ctx.body = {
                code: "10001",
                data: null,
                msg: err.message || "服务器异常"
            };
        }
    }
};
