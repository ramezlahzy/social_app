// models/Comment.js
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Agrees extends Model {}

  Agrees.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      whatIlearnedID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
    }
    },
    {
      sequelize,
      modelName: "Agrees",
      timestamps: true,

    }
  );
  return Agrees;
};
