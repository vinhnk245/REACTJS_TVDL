"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class book_image extends Model {}
book_image.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING(500),
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
    modelName: "book_image",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
book_image.associate = (db) => {

  //member
  db.book_image.belongsTo(db.member, {
    foreignKey: {
      name: "createdMemberId",
    },
  });
  db.book_image.belongsTo(db.member, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

  //book
  db.book_image.belongsTo(db.book, {
    foreignKey: {
      name: "bookId",
    },
  });

};

module.exports = () => book_image;
