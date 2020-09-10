"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class customer extends Model {}
customer.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    token: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    device_id: {
      type: Sequelize.STRING(300),
      allowNull: true,
    },
    is_customer: {
      type: Sequelize.TINYINT,
      defaultValue:0,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    province_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    avata_url: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    request_otp_count: {
      type: Sequelize.INTEGER,
      defaultValue:0,
      allowNull: false,
    },
    request_otp_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    otp_expire: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "customer",
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = () => customer;
