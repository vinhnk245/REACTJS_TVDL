"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class rented_book extends Model {}
rented_book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    readerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    memberId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    noteReder: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    noteMember: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    borrowedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    borrowedConfirmMemberId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    returnedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    returnedConfirmMemberId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    isCreatedByMember: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdObjectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    modelName: "rented_book",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
rented_book.associate = (db) => {

  //reader
  db.rented_book.belongsTo(db.reader, {
    foreignKey: {
      name: "readerId",
    },
  });

  //member
  db.rented_book.belongsTo(db.member, {
    foreignKey: {
      name: "memberId",
    },
  });
  db.rented_book.belongsTo(db.member, {
    foreignKey: {
      name: "borrowedConfirmMemberId",
    },
  });
  db.rented_book.belongsTo(db.member, {
    foreignKey: {
      name: "returnedConfirmMemberId",
    },
  });

  //rented_book_detail
  db.rented_book.hasMany(db.rented_book_detail, {
    foreignKey: {
      name: "rentedBookId",
    },
  });

  //lost_book
  db.rented_book.hasMany(db.lost_book, {
    foreignKey: {
      name: "rentedBookId",
    },
  });

};

module.exports = () => rented_book;
