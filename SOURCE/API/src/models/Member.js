"use strict";

const Sequelize = require("sequelize");
const { on } = require("nodemon");
const Model = Sequelize.Model;
var sequelize = require(__dirname + "/../config/env.js");
class member extends Model {}
member.init(
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
    joinedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING(21),
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    note: {
      type: Sequelize.STRING(500),
      allowNull: true,
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
    modelName: "member",
    freezeTableName: true,
    timestamps: false
  }
);

//add reference foreign key
member.associate = (db) => {

  //reder
  db.member.hasMany(db.reader, {
    foreignKey: {
      name: "createdMemberId",
    },
  });

  //book
  db.member.hasMany(db.book, {
    foreignKey: {
      name: "createdMemberId",
    },
  });
  db.member.hasMany(db.book, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

  //rented_book
  db.member.hasMany(db.rented_book, {
    foreignKey: {
      name: "memberId",
    },
  });
  db.member.hasMany(db.rented_book, {
    foreignKey: {
      name: "borrowedConfirmMemberId",
    },
  });
  db.member.hasMany(db.rented_book, {
    foreignKey: {
      name: "returnedConfirmMemberId",
    },
  });

  //rented_book_detail
  db.member.hasMany(db.rented_book_detail, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

  //book_image
  db.member.hasMany(db.book_image, {
    foreignKey: {
      name: "createdMemberId",
    },
  });
  db.member.hasMany(db.book_image, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

  //event
  db.member.hasMany(db.event, {
    foreignKey: {
      name: "createdMemberId",
    },
  });

  //lost_book
  db.member.hasMany(db.lost_book, {
    foreignKey: {
      name: "memberId",
    },
  });
  db.member.hasMany(db.lost_book, {
    foreignKey: {
      name: "createdMemberId",
    },
  });

  //volunteer
  db.member.hasMany(db.volunteer, {
    foreignKey: {
      name: "updatedMemberId",
    },
  });

};

module.exports = () => member;
