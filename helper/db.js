/**
 * db数据库
 */
const Sequelize = require('sequelize');
const dbConfig = require('../config').db;
// const {database, username, password, ...options} = dbConfig;
module.exports = new Sequelize(dbConfig);
