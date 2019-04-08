const redis = require('../helper/redis')
const util = require('util');
const whiteList = ['/', '/user/login', '/user/add', '/user/list', '/book/borrowRecord'];
const cget = util.promisify(redis.get.bind(redis))
const login = async (ctx, next) => {

    let url = ctx.request.url;
    if (whiteList.indexOf(url) > -1 || /^\/upload\/(.*)$/.test(url)){
        await next();
    } else {
        let auth = ctx.get('Authorization');
        const [_, token] = (auth || '').split(' ');
        // console.log('uid.....token',token);
        let result = {
            code: 401,
            data: null,
            msg: '用户未登录，请先登录'
        }
        // console.log('token...', token);
        if (!token) {
            ctx.body = result;
            return;
        }
        // console.log('client .....', redis);

        let uid = await cget(token);
        // console.log('uid.....', uid, token);
        if (!uid)  {
            ctx.body = result;
            return;
        }

        ctx.uid = uid;
        await next();
    }
}

module.exports = {
    login: login
}
