const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('associationdb11', 'root', 'codefire', {
  host: 'localhost',
  dialect: 'mysql',
  logging: true 
});

module.exports = sequelize;