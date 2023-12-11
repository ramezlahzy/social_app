// models/Comment.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {}

    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
        },
        whatIlearnedID: {
            type: DataTypes.INTEGER, // Assuming it's a foreign key to WhatIlearned
        },
        userID: {
            type: DataTypes.INTEGER, // Assuming it's a foreign key to User
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        }, {
        sequelize,
        modelName: 'Comment',
        timestamps: true,
    });
    return Comment;
}
