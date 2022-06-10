require("dotenv").config();

const express = require("express");
const app = express();

const { sequelize, Users, Scores } = require("./models");
const { body, validationResult } = require("express-validator");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const emailDuplicate = async (input) => {
  return await Users.findOne({ where: { email: input } });
};
const usernameDuplicate = async (input) => {
  return await Users.findOne({ where: { username: input } });
};

const emptyValidator = [body("username", "Username cannot be empty.").not().isEmpty(), body("email", "Email cannot be empty.").not().isEmpty(), body("password", "Password cannot be empty.").not().isEmpty()];

const validValidator = [body("email", "Email is not valid.").isEmail()];

const duplicateValidator = [
  body("username").custom(async (input) => {
    const isDuplicate = await usernameDuplicate(input);
    if (isDuplicate) {
      throw new Error("Username is already registered.");
    }
    return true;
  }),
  body("email").custom(async (input) => {
    const isDuplicate = await emailDuplicate(input);
    if (isDuplicate) {
      throw new Error("Email is already registered.");
    }
    return true;
  }),
];

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.render("dashboard", { users });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.get("/users/new", async (req, res) => {
  res.render("createuser");
});

app.post("/users/new", emptyValidator, validValidator, duplicateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { username, password, email, firstname, lastname } = req.body;
    try {
      await Users.create({ username, password, email, firstname, lastname });
      return res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    res.status(400).json(errors);
  }
});

app.get("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({
      where: { uuid },
      include: "scores",
    });
    return res.render("user", { user });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//DELETE METHOD FOR USER
app.post("/users/delete/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({ where: { uuid } });
    await user.destroy();
    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//UPDATE METHOD FOR USER
app.get("/users/edit/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({
      where: { uuid },
      include: "scores",
    });
    res.render("edituser", { user });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.post("/users/edit/:uuid", emptyValidator, validValidator, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const uuid = req.params.uuid;
    const { username, password, email, firstname, lastname } = req.body;
    try {
      const user = await Users.findOne({ where: { uuid } });

      user.username = username;
      user.password = password;
      user.email = email;
      user.firstname = firstname;
      user.lastname = lastname;

      await user.save();
      return res.redirect(`/users/${uuid}`);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    res.status(400).json(errors);
  }
});

app.get("/scores/:id", async (req, res) => {
  const userUuid = req.params.id;
  res.render("createscores", { userUuid });
});

app.post("/scores/:id", async (req, res) => {
  const userUuid = req.params.id;
  const { gameid, score } = req.body;
  try {
    const user = await Users.findOne({ where: { uuid: userUuid }, include: "scores" });
    await Scores.create({ userid: user.id, gameid, score });

    return res.redirect(`/users/${userUuid}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.post("/scores/delete/:userUuid/:gameUuid", async (req, res) => {
  const userUuid = req.params.userUuid;
  const gameUuid = req.params.gameUuid;

  try {
    const user = await Users.findOne({ where: { uuid: userUuid } });
    const score = await Scores.findOne({ where: { userid: user.id, uuid: gameUuid } });
    await score.destroy();

    return res.redirect(`/users/${userUuid}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.use(function (err, req, res, next) {
  res.status(500).json({
    status: "fail",
    errors: err.message,
  });
});

app.use(function (req, res) {
  res.status(404).json({
    status: "fail",
    errors: "Are you lost?",
  });
});

app.listen({ port: process.env.APP_PORT }, async () => {
  console.log(`App is listening on port localhost:8000.`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
