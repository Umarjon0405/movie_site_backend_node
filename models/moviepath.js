'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoviePath extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MoviePath.init({
    path: DataTypes.STRING,
    movie_id: DataTypes.INTEGER,
    number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MoviePath',
    tableName: 'movie_paths'
  });
  return MoviePath;
};