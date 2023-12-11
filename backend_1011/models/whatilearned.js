// models/WhatIlearned.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WhatIlearned extends Model {
        static associate(models) {
            // define association here
        }
    }

    WhatIlearned.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.INTEGER, // Assuming it's a foreign key to User
        },
        authorName: {
            type: DataTypes.STRING
        },
        agree: {
            type: DataTypes.JSON,
        },
        disagree: {
            type: DataTypes.JSON,
        },
        comment: {
            type: DataTypes.JSON, // Assuming it's an array of Comment IDs
        },
        reportUser: {
            type: DataTypes.JSON, // Assuming it's an array of User IDs
        },
        shareWithFriend: {
            type: DataTypes.BOOLEAN,
        },
        shareWithWorldWide: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        }, {
        sequelize,
        modelName: 'WhatIlearned',
        timestamps: true,
    });
    return WhatIlearned;
}
