'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log("model: ", model.name)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  console.log("modelName: ", db[modelName].associate)
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.User.hasMany(db.WhatIlearned, { foreignKey: 'author' }); // Assuming 'UserId' is the foreign key in the WhatIlearned table
db.WhatIlearned.belongsTo(db.User, { foreignKey: 'author' });

db.User.hasMany(db.Comment, { foreignKey: 'userID' }); // Assuming 'UserId' is the foreign key in the WhatIlearned table
db.Comment.belongsTo(db.User, { foreignKey: 'userID' });

db.Agrees.belongsTo(db.User, { foreignKey: 'userID' });
db.User.hasMany(db.Agrees, { foreignKey: 'userID' });

db.DisAgrees.belongsTo(db.User, { foreignKey: 'userID' });
db.User.hasMany(db.DisAgrees, { foreignKey: 'userID' });

db.Agrees.belongsTo(db.WhatIlearned, { foreignKey: 'whatIlearnedID' });
db.WhatIlearned.hasMany(db.Agrees, { foreignKey: 'whatIlearnedID' });

db.DisAgrees.belongsTo(db.WhatIlearned, { foreignKey: 'whatIlearnedID' });
db.WhatIlearned.hasMany(db.DisAgrees, { foreignKey: 'whatIlearnedID' });



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
