// models/Comment.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DisAgrees extends Model {}

    DisAgrees.init({
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
        },
    },
        {
        sequelize,
        modelName: 'DisAgrees',
        timestamps: true,

    });
    return DisAgrees;
}
