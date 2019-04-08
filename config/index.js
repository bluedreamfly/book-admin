/**
 * 项目配置文件
 */

module.exports = {
  db: {
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "root",
    database: "book-admin"
  },
  crypto: {
    secret: 'piaoliushu'
  }
};
