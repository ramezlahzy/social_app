const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {}

  Messages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fromUserID: {
        type: DataTypes.INTEGER,
      },
      toUserID: {
        type: DataTypes.INTEGER,
      },
      message: {
        type: DataTypes.STRING,
      },
      read: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Messages",
      timestamps: true,
    }
  );
  return Messages;
};
