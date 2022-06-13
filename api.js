require("dotenv").config();

const express = require("express");
const api = express.Router();

const { sequelize, Users, Scores, Games } = require("./models");
const { body, validationResult } = require("express-validator");
const { emptyValidator, validValidator, duplicateValidatorNew, duplicateValidatorExisting, gamesEmptyValidator, gamesDuplicateValidatorNew, gamesDuplicateValidatorExisting } = require("./function");
const e = require("express");

api.use(express.json());
api.use(express.urlencoded({ extended: false }));

//READ USERS
api.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//READ USER:ID
api.get("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({
      where: { uuid },
      include: [
        {
          association: "scores",
          include: {
            association: "game",
          },
        },
      ],
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CREATE USER
api.post("/users", emptyValidator, validValidator, duplicateValidatorNew, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { username, password, email, firstname, lastname } = req.body;
    try {
      const user = await Users.create({ username, password, email, firstname, lastname });
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(400).json(errors);
  }
});

//UPDATE USER
api.put("/users", emptyValidator, validValidator, duplicateValidatorExisting, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { uuid, username, password, email, firstname, lastname } = req.body;
    const user = await Users.findOne({ where: { uuid } });
    try {
      user.uuid = uuid;
      user.username = username;
      user.password = password;
      user.email = email;
      user.firstname = firstname;
      user.lastname = lastname;

      const updatedUser = await user.save();
      return res.json(updatedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(400).json(errors);
  }
});

//DELETE USER:ID
api.delete("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({ where: { uuid } });
    await user.destroy();
    return res.send("User deleted.");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//READ GAMES
api.get("/games", async (req, res) => {
  try {
    const games = await Games.findAll();
    return res.json(games);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//READ GAME:ID
api.get("/games/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const game = await Games.findOne({
      where: { uuid },
      include: [
        {
          association: "scores",
        },
      ],
    });
    return res.json(game);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CREATE GAME
api.post("/games", gamesEmptyValidator, gamesDuplicateValidatorNew, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { title, details, genre, imglink } = req.body;
    try {
      const game = await Games.create({ title, details, genre, imglink });
      return res.json(game);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(400).json(errors);
  }
});

//UPDATE GAME
api.put("/games", gamesEmptyValidator, gamesDuplicateValidatorExisting, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { uuid, title, details, genre, imglink } = req.body;
    const game = await Games.findOne({ where: { uuid } });
    try {
      game.uuid = uuid;
      game.title = title;
      game.details = details;
      game.genre = genre;
      game.imglink = imglink;

      const updatedGame = await game.save();
      return res.json(updatedGame);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(400).json(errors);
  }
});

//GET SCORES:USERID
api.get("/scores/user/:userUuid", async (req, res) => {
  try {
    const userUuid = req.params.userUuid;
    const user = await Users.findOne({ where: { uuid: userUuid } });
    const scores = await Scores.findAll({ where: { userid: user.id }, include: "game" });
    res.json(scores);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET SCORES:GAMEID
api.get("/scores/game/:gameUuid", async (req, res) => {
  try {
    const gameUuid = req.params.gameUuid;
    const game = await Games.findOne({ where: { uuid: gameUuid } });
    const scores = await Scores.findAll({ where: { gameid: game.id }, include: "user" });
    res.json(scores);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CREATE SCORES:USERID
api.post("/scores/:userUuid", async (req, res) => {
  const userUuid = req.params.userUuid;
  const { gameid, score } = req.body;

  const validID = gameid <= (await Games.max("id"));
  const validScore = score <= 100;

  if (validID && validScore) {
    try {
      const user = await Users.findOne({ where: { uuid: userUuid }, include: "scores" });
      const newScore = await Scores.create({ userid: user.id, gameid, score });

      return res.json(newScore);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(400).send("Invalid value provided. Please enter valid ID or score lte 100.");
  }
});

//DELETE SCORES:SCOREID
api.delete("/scores/score/:scoreUuid", async (req, res) => {
  const scoreUuid = req.params.scoreUuid;
  try {
    const score = await Scores.findOne({ where: { uuid: scoreUuid } });
    await score.destroy();

    return res.send("Score deleted.");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = api;
