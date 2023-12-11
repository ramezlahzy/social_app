// models/Notification.js
const { DataTypes, Model, INTEGER } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {}

    Notification.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userID: {
            type: DataTypes.INTEGER, // Assuming it's a foreign key to User
        },
        content: {
            type: DataTypes.STRING,
        },
        viewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        type: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        }, {
        sequelize,
        modelName: 'Notification',
        timestamps: true,
    });
    return Notification;
}

