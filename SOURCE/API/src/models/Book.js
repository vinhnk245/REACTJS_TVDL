"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class book extends Model {}
book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookCategoryId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    lost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    available: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    note: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    author: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    publishers: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    publishingYear: {
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
    updatedMemberId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    updatedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    isActive: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "book",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
book.associate = (db) => {

  //book_category
  db.book.belongsTo(db.book_category, {
    foreignKey: {
      name: "bookCategoryId",
    },
  });

  //member
  db.book.belongsTo(db.member, {
    foreignKey: {
      name: "createdMemberId",
    },
  });
  db.book.belongsTo(db.member, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

  //rented_book_detail
  db.book.hasMany(db.rented_book_detail, {
    foreignKey: {
      name: "bookId",
    },
  });

  //book_image
  db.book.hasMany(db.book_image, {
    foreignKey: {
      name: "bookId",
    },
  });

  //lost_book
  db.book.hasMany(db.lost_book, {
    foreignKey: {
      name: "bookId",
    },
  });

};

module.exports = () => book;
