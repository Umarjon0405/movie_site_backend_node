'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
  
    static associate(models) {

    }
  };
  Type.init({
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Type',
    tableName: 'types',
  });
  return Type;
};