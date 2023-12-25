// models/Comment.js
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favourites extends Model {}

  Favourites.init(
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
      modelName: "Favourites",
      timestamps: true,

    }
  );
  return Favourites;
};
