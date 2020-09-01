'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here questionId
      Answer.belongsTo(models.User, {
        foreignKey:'userId'
      });
      Answer.belongsTo(models.Question, {
        foreignKey:'questionId'
      });
    }
  }
  Answer.init({
    body: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};