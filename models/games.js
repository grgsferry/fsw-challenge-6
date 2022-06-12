"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models["Scores"], { foreignKey: "gameid", as: "scores" });
    }
  }
  Games.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.STRING },
      genre: { type: DataTypes.STRING },
      imglink: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: "games",
      modelName: "Games",
    }
  );
  return Games;
};
