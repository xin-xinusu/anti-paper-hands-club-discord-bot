const mongoose = require('mongoose');
const db = require('.');
// const bcrypt = require('bcrypt');
// var ServerGuest = require('../util/ServerGuestger');

const ServerGuestSchema = mongoose.Schema({
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guild"
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },
  arrived: {
    type: Date,
    default: Date.now()
  },
  meetingCode: {
    type: String,
    default: null
  },
  channels: {
    voice: {
      channelId: String
    },
    text: {
      channelId: String
    }
  },
  visit: {
    isInterview: { type: Boolean, default: false },
    isMeeting: { type: Boolean, default: false },
    isGeneral: { type: Boolean, default: true },
  },
  roles: {

  },
}, {
  timestamps: true
});


// Helper function - Add a method - assigned to every document created from this schema
// Compare password - compare clients entry with hashed version to see if they match
// clientSchema.methods.comparePassword = async function(candidatePassword, next){
//   try {
//     // Compare passwords with bcrypt - re-encrypt entry and see if it matches
//     let isMatch = await bcrypt.compare(candidatePassword, this.password);
//     // return true or false
//     return isMatch;
//   } catch (err) {
//     ServerGuest.error(err);
//     next(err);
//   }
// }

// Compare AuthPin
// clientSchema.methods.compareAuthPin = async function(candidatePin, next){
//   try {
//     // Compare passwords with bcrypt - re-encrypt entry and see if it matches
//     let isMatch = candidatePin === this.history.preAuth[0].preAuthPin;
//     console.ServerGuest(isMatch);
//     if(isMatch){
//       this.history.preAuth[0].used = true;
//       this.save()
//     }
//     return isMatch;
//   } catch (err) {
//     ServerGuest.error(err);
//     next(err);
//   }
// }

// Update Pre Auth History
// clientSchema.methods.updatePreAuthData = async function(pin, communicationObj){
//   try {
//     console.ServerGuest("Updating PreAuth")
//     const preAuthArray = this.history.preAuth;
//     console.ServerGuest("preAuthArray", preAuthArray)
//
//     const updateObj = await { date: Date.now(), preAuthPin: pin, communicated: communicationObj };
//     console.ServerGuest("Unshifting", updateObj)
//     await preAuthArray.unshift( updateObj )
//     const isOver100 = preAuthArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < preAuthArray.length; i++) {
//         if(i >= 100){
//           await preAuthArray.remove(preAuthArray[i]._id);
//         }
//       }
//     }
//     console.ServerGuest("Updated PreAuth")
//     this.save()
//   } catch (err) {
//     ServerGuest.error(err);
//   }
// }

// // Update ServerGuestin History
// clientSchema.methods.ServerGuestinUpdate = async function(token, source){
//   try {
//     const lastServerGuestinArray = this.history.lastServerGuestin;
//     const updateObj = await { date: Date.now(), token: token, source };
//     await lastServerGuestinArray.unshift( updateObj )
//     const isOver100 = lastServerGuestinArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < lastServerGuestinArray.length; i++) {
//         if(i >= 100){
//           await lastServerGuestinArray.remove(lastServerGuestinArray[i]._id);
//         }
//       }
//     }
//     this.save()
//   } catch (err) {
//     ServerGuest.error(err);
//   }
// }

const ServerGuest = mongoose.model('ServerGuest', ServerGuestSchema);

// Export
module.exports = ServerGuest;
