"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("scores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userid: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      gameid: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      score: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("scores");
  },
};
