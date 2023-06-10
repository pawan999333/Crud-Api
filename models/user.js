const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const User = sequelize.define('users', {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{timestamps:false});

module.exports = User;
