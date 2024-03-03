const mongoose = require('mongoose');
const db = require('./');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const TicketSchema = mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  }],
  channel: {
    channelId: String,
  },
  query: String,
  message: {
    content: String,
    messageId: String
  }

}, {
  timestamps: true
});



const Ticket = mongoose.model('Ticket', TicketSchema);

// Export
module.exports = Ticket;
