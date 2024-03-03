require('dotenv').config();
const mongoose = require('mongoose');

exports.setDatabase = function (status){
  if(status === "development"){
    // Mongo Queries Displayed
    mongoose.set('debug', true);

    // Promise library - dont need to use callback function -also for async purposes
    mongoose.Promise = Promise;

    // Connect to mongoDB
    mongoose.connect(process.env.DISCORD_BOT_TEST, {
      keepAlive: true,
    })

  } else if(status === "production"){
    // Mongo Queries Displayed
    mongoose.set('debug', false);

    // Promise library - dont need to use callback function -also for async purposes
    mongoose.Promise = Promise;

    // Connect to mongoDB
    mongoose.connect(process.env.DISCORD_BOT_LIVE, {
      keepAlive: true,
    });
  }
}

// BUNDLING - Allows for the use of db.Schema
// // EXPORT DB schemas
// module.exports.AuthReceipt = require('./authReceipt.model')
// module.exports.Log = require("./log.model");
// module.exports.Member = require("./member.model");
// module.exports.Role = require("./role.model");
// module.exports.SystemLogs = require("./system-log.model");

// module.exports.Guild = require("./guild.model");
// module.exports.Channel = require("./channel.model");
// module.exports.Notice = require("./notice.model");
// module.exports.Schedule = require('./schedule.model')
// module.exports.RadioStation = require('./radio-station.model')

// module.exports.Member = require('./member.model')

// module.exports.ServerGuest = require('./server-guest.model')
