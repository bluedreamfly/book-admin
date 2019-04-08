const router = require('./helper/router');
const fs = require('fs');
const baseDir = './controller';

//这样以后加个控制器直接不需要引入，重启就可以了
let controFiles = fs.readdirSync(baseDir);
let controModules = controFiles.map(file => {
    return require(`${baseDir}/${file}`);
})

module.exports = {
  init() {
    controModules.forEach(module => {
      Object.keys(module || {}).forEach(key => {
        let [method, url] = key.split(' ');
        router[method.toLocaleLowerCase()](url, module[key]);
      })
    })
  }
}
