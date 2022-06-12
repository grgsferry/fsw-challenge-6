"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Scores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Games }) {
      // define association here
      this.belongsTo(Users, { foreignKey: "userid", as: "user" });
      this.belongsTo(Games, { foreignKey: "gameid", as: "game" });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userid: undefined };
    }
  }
  Scores.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gameid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "scores",
      modelName: "Scores",
    }
  );
  return Scores;
};
