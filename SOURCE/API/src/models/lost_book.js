"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class lost_book extends Model {}
lost_book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    readerId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    memberId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    bookId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    rentedBookId: {
      type: Sequelize.INTEGER,
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
    modelName: "lost_book",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
lost_book.associate = (db) => {

  //member
  db.lost_book.belongsTo(db.member, {
    foreignKey: {
      name: "createdMemberId",
    },
  });
  db.lost_book.belongsTo(db.member, {
    foreignKey: {
      name: "memberId",
    },
  });

  //reader
  db.lost_book.belongsTo(db.reader, {
    foreignKey: {
      name: "readerId",
    },
  });

  //book
  db.lost_book.belongsTo(db.book, {
    foreignKey: {
      name: "bookId",
    },
  });

  //rented_book
  db.lost_book.belongsTo(db.rented_book, {
    foreignKey: {
      name: "rentedBookId",
    },
  });

};

module.exports = () => lost_book;
