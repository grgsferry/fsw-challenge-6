const { Users, Games } = require("./models");
const { body } = require("express-validator");
const { Op } = require("sequelize");

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

module.exports = { emptyValidator, validValidator, duplicateValidatorNew, duplicateValidatorExisting, gamesEmptyValidator, gamesDuplicateValidatorNew, gamesDuplicateValidatorExisting };
