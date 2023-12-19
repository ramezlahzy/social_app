const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {}

  Friends.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userID1: {
        type: DataTypes.INTEGER, 
      },
      userID2: {
        type: DataTypes.INTEGER, 
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Friends",
      timestamps: true,
    }
  );
  return Friends;
};
