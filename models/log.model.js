const mongoose = require('mongoose');
const db = require('./');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const LogSchema = mongoose.Schema({
  date: { type: Number, default: Date.now() },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },
  message: {
    content: String,
    ref: String
  },
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guild"
  },
  log: {
    method: String,
    data: String
  }
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
//     log.error(err);
//     next(err);
//   }
// }

// Compare AuthPin
// clientSchema.methods.compareAuthPin = async function(candidatePin, next){
//   try {
//     // Compare passwords with bcrypt - re-encrypt entry and see if it matches
//     let isMatch = candidatePin === this.history.preAuth[0].preAuthPin;
//     console.log(isMatch);
//     if(isMatch){
//       this.history.preAuth[0].used = true;
//       this.save()
//     }
//     return isMatch;
//   } catch (err) {
//     log.error(err);
//     next(err);
//   }
// }

// Update Pre Auth History
// clientSchema.methods.updatePreAuthData = async function(pin, communicationObj){
//   try {
//     console.log("Updating PreAuth")
//     const preAuthArray = this.history.preAuth;
//     console.log("preAuthArray", preAuthArray)
//
//     const updateObj = await { date: Date.now(), preAuthPin: pin, communicated: communicationObj };
//     console.log("Unshifting", updateObj)
//     await preAuthArray.unshift( updateObj )
//     const isOver100 = preAuthArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < preAuthArray.length; i++) {
//         if(i >= 100){
//           await preAuthArray.remove(preAuthArray[i]._id);
//         }
//       }
//     }
//     console.log("Updated PreAuth")
//     this.save()
//   } catch (err) {
//     log.error(err);
//   }
// }

// // Update Login History
// clientSchema.methods.loginUpdate = async function(token, source){
//   try {
//     const lastLoginArray = this.history.lastLogin;
//     const updateObj = await { date: Date.now(), token: token, source };
//     await lastLoginArray.unshift( updateObj )
//     const isOver100 = lastLoginArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < lastLoginArray.length; i++) {
//         if(i >= 100){
//           await lastLoginArray.remove(lastLoginArray[i]._id);
//         }
//       }
//     }
//     this.save()
//   } catch (err) {
//     log.error(err);
//   }
// }

const Log = mongoose.model('Log', LogSchema);

// Export
module.exports = Log;
