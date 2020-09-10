"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class event extends Model {}
event.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    linkGoogleForm: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    eventDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    createdMemberId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    createdDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    isActive: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "event",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
event.associate = (db) => {

  //member
  db.event.belongsTo(db.member, {
    foreignKey: {
      name: "createdMemberId",
    },
  });

};

module.exports = () => event;
