// models/Comment.js
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Locations extends Model {}

  Locations.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
      country: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Locations",
      timestamps: true,
    }
  );
  return Locations;
};
