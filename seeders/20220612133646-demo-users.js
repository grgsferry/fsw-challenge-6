"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        uuid: "d2073560-e627-46a4-b9f9-c6a11e075f84",
        username: "gferry",
        password: "password",
        email: "gferry@gmail.com",
        firstname: "G.",
        lastname: "Ferry",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "717005d1-2c91-4c1f-88f5-8bd88977e797",
        username: "johndoe",
        password: "password",
        email: "john.doe@gmail.com",
        firstname: "John",
        lastname: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "7bc9ef28-b7aa-4b08-b793-c798755c8598",
        username: "mary.e",
        password: "password",
        email: "maryelizabet@gmail.com",
        firstname: "Mary Elizabeth",
        lastname: "Winstead",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
