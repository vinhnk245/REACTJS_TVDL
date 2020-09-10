"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class user extends Model {}
user.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    user_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    token:{
      type:Sequelize.STRING(255),
      allowNull:true
    },
    modified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "user",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = () => user;
