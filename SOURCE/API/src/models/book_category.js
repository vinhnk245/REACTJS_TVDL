"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class book_category extends Model {}
book_category.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    logo: {
      type: Sequelize.STRING(200),
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
    modelName: "book_category",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
book_category.associate = (db) => {

  db.book_category.hasMany(db.book, {
    foreignKey: {
      name: "bookCategoryId",
    },
  });

};

module.exports = () => book_category;
