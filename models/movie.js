'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      this.hasOne(models.MoviePath, {as: 'movie_path', foreignKey: 'movie_id'})
      this.belongsTo(models.Type, {as: 'type', foreignKey: 'type_id'})
    }
  };
  Movie.init({
    title: {
      type: DataTypes.STRING,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
    },
    type_id: {
      type: DataTypes.INTEGER,
    },
    image_path: {
      type: DataTypes.TEXT
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies'
  });
  return Movie;
};