const Koa = require('koa');
const koaBody = require('koa-body');
const static = require('koa-static')
const path = require('path');
const router = require('./helper/router');
const controller = require('./router');
const db = require('./models');
const {login} = require('./middleware/gateWay')
// console.log('log db...', db);
//生成app实例
const app = new Koa();

//初始化控制器
controller.init();

//中间件
app
  .use(static(
    path.join(__dirname, '.')
  ))
  .use(koaBody({
    multipart: true,
  }))
  .use(login)
  .use(router.routes())
  .use(router.allowedMethods());

//监听端口
app.listen(3000, () => {
   console.log('app startup 3000');
});
