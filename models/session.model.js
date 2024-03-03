const mongoose = require('mongoose');
const db = require('./');


const SessionSchema = mongoose.Schema({
  botName: String,
  channels: {
    adminNotice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    },
    welcome: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    },
    general: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    },
  },
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guild"
  },











  guildId: String,
}, {
  timestamps: true
});


const Session = mongoose.model('Session', SessionSchema);

// Export
module.exports = Session;
