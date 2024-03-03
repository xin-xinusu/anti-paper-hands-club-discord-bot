const mongoose = require('mongoose');
const db = require('.');

const NoticeSchema = mongoose.Schema({
  channelId: String,
  message: String,
  frequency: Number,
  messageId: String
}, {
  timestamps: true
});


const Notice = mongoose.model('Notice', NoticeSchema);

// Export
module.exports = Notice;
