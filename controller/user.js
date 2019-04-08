// const User = require('../models/User');
const User = require('../models/index').user;
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const {decrypt, encrypt} = require('../helper/crypto');
const redis = require('../helper/redis')
const db = require('../models');
const fs = require('fs');

// console.log('db.......', db.User);


module.exports = {
  'POST /user/login': async (ctx, next) =>{
    //   console.log('用户uid....', ctx.uid);
    const md5 = crypto.createHash('md5');
    const { passwd, employeeNo} = ctx.request.body;
    let user = await User.findOne({
        where: {
            employeeNo: employeeNo
        }
    })
    if (!user) {
        ctx.body = {
            code: '10002',
            data: null,
            msg: '当前用户不存在，请先注册'
        }
        return;
    } else {
        let nowPassWd = md5.update(passwd).digest('hex');
        if (nowPassWd != user.passwd) {
            ctx.body = {
                code: '10003',
                data: null,
                msg: '密码不正确'
            }
            return;
        }

        let token = encrypt(`${user.id}${Date.now()}`);
        redis.set(token, user.id, 'EX', 60 * 60 * 4);
        ctx.body = {
            code: '200',
            data: {
                ...user.dataValues,
                token: token
            },
            msg: ''
        }
    }
  },

  'POST /user/add': async (ctx, next) => {
    const md5 = crypto.createHash('md5');
    const { passwd, ...rest } = ctx.request.body || {};
    try {
        let user = await User.findOne({
            where: {
                employeeNo: rest.employeeNo
            }
        })
        if (user) {
            ctx.body = {
                code: '10006',
                data: null,
                msg: '该员工已经存在'
            }
            return;
        }
        user = await User.create({
            ...rest,
            passwd: md5.update(passwd).digest('hex')
        });

        let token = encrypt(`${user.id}${Date.now()}`);
        redis.set(token, user.id, 'EX', 60 * 60 * 4);

        ctx.body = {
            code: '200',
            data: {
                ...user.dataValues,
                token: token
            },
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

  'GET /user/info': async (ctx, next) => {
    try {
        let userId = ctx.uid;
        let user = await User.findOne({where: {id: userId}});
        if (!user) {
            ctx.body = {
                code: 401,
                data: null,
                msg: '用户未登录'
            }
            return;
        }
        ctx.body = {
            code: 200,
            data: user,
            msg: ''
        }
    } catch(e) {
        ctx.body = {
            code: '10002',
            data: null,
            msg: e.message || '服务器异常'
        }
    }
  },

  'GET /user/list': async (ctx, next) => {
    let list = await User.findAll();
    ctx.body = {
        code: 200,
        data: list,
        msg: ''
    }
  },

  'POST /user/:id': async (ctx, next) => {
    try {
        let userId = ctx.params.id;
        let user = await User.findOne({where: {id: userId}});

        // console.log(ctx.request.body);
        await User.update({...user, ...ctx.request.body}, {
            where: {id: userId}
        });
        ctx.body = {
            code: '200',
            data: null,
            msg: ''
        }
    } catch(e) {
        ctx.body = {
            code: '10002',
            data: null,
            msg: e.message || '服务器异常'
        }
    }
  },

  'POST /user/update/avator': async (ctx, next) => {
    const file = ctx.request.files.file;	// 获取上传文件
    const reader = fs.createReadStream(file.path);	// 创建可读流
    const ext = file.name.split('.').pop();		// 获取上传文件扩展名
    let fileDir = `upload/${Math.random().toString()}.${ext}`
    let avator = `http://boss-dev.dbike.co/${fileDir}`;
    let user = await User.findOne({where: {id: ctx.uid}});


    await User.update({...user, avator: avator}, {
        where: {id: ctx.uid}
    });
    const upStream = fs.createWriteStream(`./${fileDir}`);		// 创建可写流
    reader.pipe(upStream);	// 可读流通过管道写入可写流
    ctx.body = {
        code: 200,
        data: avator,
        msg: '上传成功'
    }
  }
}
