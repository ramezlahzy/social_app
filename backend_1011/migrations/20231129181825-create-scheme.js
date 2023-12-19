"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
      },
      whatIlearnedID: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to WhatIlearned
      },
      userID: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fromUserID: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      toUserID: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      message: {
        type: Sequelize.STRING,
      },
      read: {
        type: Sequelize.BOOLEAN,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("TempUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      expiresAt: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("WhatIlearneds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      authorName: {
        type: Sequelize.STRING,
      },
      agree: {
        type: Sequelize.JSON,
      },
      disagree: {
        type: Sequelize.JSON,
      },
      comment: {
        type: Sequelize.JSON, // Assuming it's an array of Comment IDs
      },
      reportUser: {
        type: Sequelize.JSON, // Assuming it's an array of User IDs
      },
      shareWithFriend: {
        type: Sequelize.BOOLEAN,
      },
      shareWithWorldWide: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      expoPushToken: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      favoriteWIL: {
        type: Sequelize.JSON,
      },
      friend: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      content: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Friends", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID1: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      userID2: {
        type: Sequelize.INTEGER, // Assuming it's a foreign key to User
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
      await queryInterface.createTable("Agrees", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        whatIlearnedID: {
          type: Sequelize.INTEGER, // Assuming it's a foreign key to WhatIlearned
        },
        userID: {
          type: Sequelize.INTEGER, // Assuming it's a foreign key to User
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable("DisAgrees", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        whatIlearnedID: {
          type: Sequelize.INTEGER, // Assuming it's a foreign key to WhatIlearned
        },
        userID: {
          type: Sequelize.INTEGER, // Assuming it's a foreign key to User
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
    await queryInterface.dropTable("TempUsers");
    await queryInterface.dropTable("WhatIlearneds");
    await queryInterface.dropTable("Comments");
    await queryInterface.dropTable("Notifications");
    await queryInterface.dropTable("Friends");
    await queryInterface.dropTable("Agrees");
    await queryInterface.dropTable("DisAgrees");
    await queryInterface.dropTable("Messages");
  },
};
