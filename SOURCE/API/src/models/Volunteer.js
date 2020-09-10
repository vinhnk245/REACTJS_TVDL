"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class volunteer extends Model {}
volunteer.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING(21),
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    linkFacebook: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true
    },
    reasons: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    contributes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    createdDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updatedMemberId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    isActive: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "volunteer",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
volunteer.associate = (db) => {

  //member
  db.volunteer.belongsTo(db.member, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

};

module.exports = () => volunteer;
