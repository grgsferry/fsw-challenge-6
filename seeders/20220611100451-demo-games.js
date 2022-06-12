"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("games", [
      {
        uuid: "3a922eb0-8f42-4a2a-a7dc-60fda716c899",
        title: "DOTA 2",
        details:
          "Dota 2 is a multiplayer online battle arena (MOBA) video game in which two teams of five players compete to collectively destroy a large structure defended by the opposing team known as the Ancient, whilst defending their own.",
        genre: "Strategy",
        imglink: "/assets/dota-2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "66c1ac7f-a781-4005-8c35-39202a395976",
        title: "Counter-Strike: Global Offensive",
        details: "CS:GO stands for Counter-Strike: Global Offensive, a multiplayer first-person shooter created in the 2010s, popular among casual and professional gamers on both computers and consoles.",
        genre: "First Person Shooter",
        imglink: "/assets/counter-strike.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "f7b87057-db7e-4d09-9406-12fe58a6e930",
        title: `Player's Unknown Battle Ground (PUBG)`,
        details:
          "PUBG is a player versus player shooter game in which up to one hundred players fight in a battle royale, a type of large-scale last man standing deathmatch where players fight to remain the last alive. Players can choose to enter the match solo, duo, or with a small team of up to four people.",
        genre: "Action Adventure",
        imglink: "/assets/pubg.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "db320423-9016-43ec-a2bb-198addd49627",
        title: "Fortnite",
        details:
          "Fortnite is a survival game where 100 players fight against each other in player versus player combat to be the last one standing. It is a fast-paced, action-packed game, not unlike The Hunger Games, where strategic thinking is a must in order to survive.",
        genre: "Action Adventure",
        imglink: "/assets/fortnite.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "122e85e9-3dff-412d-b7c4-4df95db0afa6",
        title: "League of Legends (LOL)",
        details:
          "League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other's base. Choose from over 140 champions to make epic plays, secure kills, and take down towers as you battle your way to victory.",
        genre: "Strategy",
        imglink: "/assets/league-of-legends.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "fd79707b-9e14-4f9f-ba53-b5086a89f448",
        title: "Hearthstone",
        details:
          "Set within the Warcraft universe, Hearthstone is a digital-only, turn-based collectible card game which pits two opponents against each other. Players select a hero from one of ten classes. All classes have unique cards and abilities, known as hero powers, which help define class archetypes.",
        genre: "Cards",
        imglink: "/assets/hearthstone.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "6890ced9-ba07-406a-9c90-07f5953122fd",
        title: "Minecraft",
        details:
          "Minecraft is a video game in which players create and break apart various kinds of blocks in three-dimensional worlds. The game's two main modes are Survival and Creative. In Survival, players must find their own building supplies and food. They also interact with blocklike mobs, or moving creatures.",
        genre: "Action Adventure",
        imglink: "/assets/minecraft.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "91b0a944-cf3e-417e-a543-9ca174feae76",
        title: "Grand Theft Auto V",
        details:
          "Grand Theft Auto V is an action-adventure game played from either a third-person or first-person perspective. Players complete missions—linear scenarios with set objectives—to progress through the story. Outside of the missions, players may freely roam the open world.",
        genre: "Action Adventure",
        imglink: "/assets/gta-v.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "09df0c9f-35ad-46a6-9d14-37c5cac3569f",
        title: "Among Us",
        details:
          "Among Us is basically a game of survival, where you either have to vote off all of the imposters and complete all the tasks, and the imposter has to kill all of the crewmates or stop them from completing the designated tasks to win.",
        genre: "Strategy",
        imglink: "/assets/among-us.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: "9355ffec-72da-4c38-989b-cbb1f1870538",
        title: "Valorant",
        details:
          "Valorant is a team-based first-person hero shooter set in the near future. Players play as one of a set of Agents, characters designed based on several countries and cultures around the world. In the main game mode, players are assigned to either the attacking or defending team with each team having five players on it.",
        genre: "First Person Shooter",
        imglink: "/assets/valorant.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("games", null, {});
  },
};
