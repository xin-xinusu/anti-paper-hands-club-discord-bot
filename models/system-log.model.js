const mongoose = require('mongoose');
const db = require('./');
// const bcrypt = require('bcrypt');
// var SystemLog = require('../util/SystemLogger');

const SystemLogSchema = mongoose.Schema({
  date: { type: Number, default: Date.now() },
  logType: String,
  message: String,
  functionName: String,
  logData: {
    code: Number,
    data: String,
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
//     SystemLog.error(err);
//     next(err);
//   }
// }

// Compare AuthPin
// clientSchema.methods.compareAuthPin = async function(candidatePin, next){
//   try {
//     // Compare passwords with bcrypt - re-encrypt entry and see if it matches
//     let isMatch = candidatePin === this.history.preAuth[0].preAuthPin;
//     console.SystemLog(isMatch);
//     if(isMatch){
//       this.history.preAuth[0].used = true;
//       this.save()
//     }
//     return isMatch;
//   } catch (err) {
//     SystemLog.error(err);
//     next(err);
//   }
// }

// Update Pre Auth History
// clientSchema.methods.updatePreAuthData = async function(pin, communicationObj){
//   try {
//     console.SystemLog("Updating PreAuth")
//     const preAuthArray = this.history.preAuth;
//     console.SystemLog("preAuthArray", preAuthArray)
//
//     const updateObj = await { date: Date.now(), preAuthPin: pin, communicated: communicationObj };
//     console.SystemLog("Unshifting", updateObj)
//     await preAuthArray.unshift( updateObj )
//     const isOver100 = preAuthArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < preAuthArray.length; i++) {
//         if(i >= 100){
//           await preAuthArray.remove(preAuthArray[i]._id);
//         }
//       }
//     }
//     console.SystemLog("Updated PreAuth")
//     this.save()
//   } catch (err) {
//     SystemLog.error(err);
//   }
// }

// // Update SystemLogin History
// clientSchema.methods.SystemLoginUpdate = async function(token, source){
//   try {
//     const lastSystemLoginArray = this.history.lastSystemLogin;
//     const updateObj = await { date: Date.now(), token: token, source };
//     await lastSystemLoginArray.unshift( updateObj )
//     const isOver100 = lastSystemLoginArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < lastSystemLoginArray.length; i++) {
//         if(i >= 100){
//           await lastSystemLoginArray.remove(lastSystemLoginArray[i]._id);
//         }
//       }
//     }
//     this.save()
//   } catch (err) {
//     SystemLog.error(err);
//   }
// }

const SystemLog = mongoose.model('SystemLog', SystemLogSchema);

// Export
module.exports = SystemLog;
