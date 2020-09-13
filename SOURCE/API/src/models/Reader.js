"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class reader extends Model {}
reader.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account: {
      type: Sequelize.STRING(21),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    cardNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    parentName: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    parentPhone: {
      type: Sequelize.STRING(21),
      allowNull: true,
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    note: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    lost: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    deviceId: {
      type: Sequelize.STRING(200),
      allowNull: true,
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
    modelName: "reader",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
reader.associate = (db) => {

  //member
  db.reader.belongsTo(db.member, {
    foreignKey: {
      name: "createdMemberId",
    },
  });

  //rented_book
  db.reader.hasMany(db.rented_book, {
    foreignKey: {
      name: "readerId",
    },
  });

  //lost_book
  db.reader.hasMany(db.lost_book, {
    foreignKey: {
      name: "readerId",
    },
  });

};

module.exports = () => reader;
