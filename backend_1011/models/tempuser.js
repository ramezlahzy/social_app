// models/TempUser.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TempUser extends Model {}

    TempUser.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    token: {
        type: DataTypes.STRING,
    },
    expiresAt: {
        type: DataTypes.DATE,
    },
    }, {
    sequelize,
    modelName: 'TempUser',
    timestamps: false, // No need for timestamps in this table
    });

    return TempUser;
}