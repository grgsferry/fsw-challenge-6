"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("scores", [
      {
        uuid: "a17ab690-79f4-4d5c-8ed9-4a942748cc23",
        userid: 1,
        gameid: 1,
        score: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "b2f9bdac-b0e4-4e88-9141-c7c34ea2a0b3",
        userid: 1,
        gameid: 2,
        score: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "21cb1b74-7bb8-4080-849a-d3d02110e5af",
        userid: 1,
        gameid: 3,
        score: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "542e8b2f-ed1c-46f4-9d7f-e8255a5d5048",
        userid: 1,
        gameid: 4,
        score: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "05e45300-7361-420a-b6d1-09d9d74c4007",
        userid: 2,
        gameid: 5,
        score: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "247e35c4-7a6b-404c-ac6f-3b0ef6910068",
        userid: 2,
        gameid: 6,
        score: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "c0037e72-e931-44ce-8144-2a435c357dd1",
        userid: 2,
        gameid: 7,
        score: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "c98d160c-ae2b-4378-b753-e22e3ffac3af",
        userid: 3,
        gameid: 8,
        score: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "0ab000b7-d563-48f3-acc6-c5e157e7ff87",
        userid: 3,
        gameid: 9,
        score: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "c05487be-afe2-4e7b-b648-7819dcccddc4",
        userid: 3,
        gameid: 10,
        score: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("scores", null, {});
  },
};
