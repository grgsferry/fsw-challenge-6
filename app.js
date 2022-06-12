require("dotenv").config();

const express = require("express");
const app = express();

const { sequelize, Users, Scores, Games } = require("./models");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Validator Middlewares
const emailDuplicateNew = async (input) => {
  return await Users.findOne({
    where: { email: input.email },
  });
};

const usernameDuplicateNew = async (input) => {
  return await Users.findOne({
    where: { username: input.username },
  });
};

const gamesDuplicateNew = async (input) => {
  return await Games.findOne({
    where: { title: input.title },
  });
};

const emailDuplicateExisting = async (input) => {
  return await Users.findOne({
    where: {
      email: input.email,
      uuid: { [Op.not]: input.uuid },
    },
  });
};

const usernameDuplicateExisting = async (input) => {
  return await Users.findOne({
    where: {
      username: input.username,
      uuid: { [Op.not]: input.uuid },
    },
  });
};

const gamesDuplicateExisting = async (input) => {
  return await Games.findOne({
    where: {
      title: input.title,
      uuid: { [Op.not]: input.uuid },
    },
  });
};

const emptyValidator = [body("username", "Username cannot be empty.").not().isEmpty(), body("email", "Email cannot be empty.").not().isEmpty(), body("password", "Password cannot be empty.").not().isEmpty()];
const validValidator = [body("email", "Email is not valid.").isEmail()];
const duplicateValidatorNew = [
  body().custom(async (input) => {
    const isDuplicate = await emailDuplicateNew(input);
    if (isDuplicate) {
      throw new Error("Email is already registered.");
    }
    return true;
  }),
  body().custom(async (input) => {
    const isDuplicate = await usernameDuplicateNew(input);
    if (isDuplicate) {
      throw new Error("Username is already registered.");
    }
    return true;
  }),
];

const duplicateValidatorExisting = [
  body().custom(async (input) => {
    const isDuplicate = await emailDuplicateExisting(input);
    if (isDuplicate) {
      throw new Error("Email is already registered.");
    }
    return true;
  }),
  body().custom(async (input) => {
    const isDuplicate = await usernameDuplicateExisting(input);
    if (isDuplicate) {
      throw new Error("Username is already registered.");
    }
    return true;
  }),
];

const gamesEmptyValidator = [body("title", "Title cannot be empty.").not().isEmpty()];
const gamesDuplicateValidatorNew = [
  body().custom(async (input) => {
    const isDuplicate = await gamesDuplicateNew(input);
    if (isDuplicate) {
      throw new Error("Game is already registered.");
    }
    return true;
  }),
];

const gamesDuplicateValidatorExisting = [
  body().custom(async (input) => {
    const isDuplicate = await gamesDuplicateExisting(input);
    if (isDuplicate) {
      throw new Error("Game is already registered.");
    }
    return true;
  }),
];

//Login Middleware
let loginStatus = false;

const checkLogin = (req, res, next) => {
  if (loginStatus === true) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loginCredentialValidator = [
  body("username").custom(async (input) => {
    if (input !== process.env.ADMIN_USERNAME) {
      throw new Error("Invalid username.");
    }
    return true;
  }),
  body("password").custom(async (input) => {
    if (input !== process.env.ADMIN_PASSWORD) {
      throw new Error("Invalid password.");
    }
    return true;
  }),
];

//Login Endpoint
app.get("/login", async (req, res) => {
  if (loginStatus === false) {
    res.render("login");
  } else {
    res.redirect("/dashboard/users");
  }
});

app.post("/login", loginCredentialValidator, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    loginStatus = true;
    res.redirect("/dashboard/users");
  } else {
    loginStatus = false;
    const alert = errors.array();
    res.render("login", { alert });
  }
});

//READ Dashboard Users
app.get("/", checkLogin, async (req, res) => {
  await res.redirect("/dashboard/users");
});

app.get("/dashboard/users", checkLogin, async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.render("dashboard", { users });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//READ Dashboard Games
app.get("/dashboard/games", checkLogin, async (req, res) => {
  try {
    const games = await Games.findAll();
    return res.render("dashboardgames", { games });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CREATE New User
app.get("/users/new", checkLogin, async (req, res) => {
  res.render("createuser");
});

app.post("/users/new", checkLogin, emptyValidator, validValidator, duplicateValidatorNew, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { username, password, email, firstname, lastname } = req.body;
    try {
      await Users.create({ username, password, email, firstname, lastname });
      return res.redirect("/dashboard/users");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    const alert = errors.array();
    res.status(400);
    res.render("createuser", { alert });
  }
});

//CREATE New Game
app.get("/games/new", checkLogin, async (req, res) => {
  res.render("creategames");
});

app.post("/games/new", checkLogin, gamesEmptyValidator, gamesDuplicateValidatorNew, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { title, details, genre, imglink } = req.body;
    try {
      await Games.create({ title, details, genre, imglink });
      return res.redirect("/dashboard/games");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    const alert = errors.array();
    res.status(400);
    res.render("creategames", { alert });
  }
});

//READ User By UUID
app.get("/users/:uuid", checkLogin, async (req, res) => {
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
    return res.render("user", { user });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//READ Game By UUID
app.get("/games/:uuid", checkLogin, async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const game = await Games.findOne({ where: { uuid } });
    return res.render("game", { game });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE User By UUID
app.post("/users/delete/:uuid", checkLogin, async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({ where: { uuid } });
    await user.destroy();
    return res.redirect("/dashboard/users");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE Game By UUID
// app.post("/games/delete/:uuid", checkLogin, async (req, res) => {
//   const uuid = req.params.uuid;
//   try {
//     const game = await Games.findOne({ where: { uuid } });
//     await game.destroy();
//     return res.redirect("/dashboard/games");
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//UPDATE User By UUID
app.get("/users/edit/:uuid", checkLogin, async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({
      where: { uuid },
      include: "scores",
    });
    res.render("edituser", { user });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.post("/users/edit/:uuid", checkLogin, emptyValidator, validValidator, duplicateValidatorExisting, async (req, res) => {
  const uuid = req.params.uuid;
  const user = await Users.findOne({ where: { uuid } });
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { uuid, username, password, email, firstname, lastname } = req.body;
    try {
      user.uuid = uuid;
      user.username = username;
      user.password = password;
      user.email = email;
      user.firstname = firstname;
      user.lastname = lastname;

      await user.save();
      return res.redirect(`/users/${uuid}`);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    const alert = errors.array();
    res.status(400);
    res.render("edituser", { alert, user });
  }
});

//UPDATE Game By UUID
app.get("/games/edit/:uuid", checkLogin, async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const game = await Games.findOne({ where: { uuid } });
    res.render("editgame", { game });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.post("/games/edit/:uuid", checkLogin, gamesEmptyValidator, gamesDuplicateValidatorExisting, async (req, res) => {
  const uuid = req.params.uuid;
  const game = await Games.findOne({ where: { uuid } });
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { uuid, title, details, genre, imglink } = req.body;
    try {
      game.uuid = uuid;
      game.title = title;
      game.details = details;
      game.genre = genre;
      game.imglink = imglink;

      await game.save();
      return res.redirect(`/games/${uuid}`);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    const alert = errors.array();
    res.status(400);
    res.render("editgame", { alert, game });
  }
});

//CREATE Score By User's UUID
app.get("/scores/:userUuid", checkLogin, async (req, res) => {
  const userUuid = req.params.userUuid;
  const totalGames = await Games.count({ col: "uuid" });
  const games = await Games.findAll();
  res.render("createscores", { userUuid, totalGames, games });
});

app.post("/scores/:userUuid", checkLogin, async (req, res) => {
  const userUuid = req.params.userUuid;
  const { gameid, score } = req.body;
  try {
    const user = await Users.findOne({ where: { uuid: userUuid }, include: "scores" });
    await Scores.create({ userid: user.id, gameid, score });

    return res.redirect(`/users/${userUuid}`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE Score By User's UUID and Score's UUID
app.post("/scores/delete/:userUuid/:scoreUuid", checkLogin, async (req, res) => {
  const userUuid = req.params.userUuid;
  const scoreUuid = req.params.scoreUuid;

  try {
    const user = await Users.findOne({ where: { uuid: userUuid } });
    const score = await Scores.findOne({ where: { userid: user.id, uuid: scoreUuid } });
    await score.destroy();

    return res.redirect(`/users/${userUuid}`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Logout Endpoint
app.get("/logout", checkLogin, (req, res) => {
  loginStatus = false;
  res.redirect("/login");
});

//500 Error Handler
app.use(function (err, req, res, next) {
  res.status(500).json({
    status: "fail",
    errors: err.message,
  });
});

//404 Error Handler
app.use(function (req, res) {
  res.status(404).json({
    status: "fail",
    errors: "Are you lost?",
  });
});

//Start App
app.listen({ port: process.env.APP_PORT }, async () => {
  console.log(`App is listening on port localhost:3000.`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
