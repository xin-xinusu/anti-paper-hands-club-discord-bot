const mongoose = require('mongoose');
const db = require('.');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const ScheduleSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  type: String,
  endDate: Date,
  nextRunAt: Date,
  priority: Number,
  repeatInterval: String,
  repeatTimezone: String,
  shouldSaveResult: Boolean,
  lastRunAt: Date
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

// // Update Schedulein History
// clientSchema.methods.loginUpdate = async function(token, source){
//   try {
//     const lastScheduleinArray = this.history.lastSchedulein;
//     const updateObj = await { date: Date.now(), token: token, source };
//     await lastScheduleinArray.unshift( updateObj )
//     const isOver100 = lastScheduleinArray.length >= 100;
//     if(isOver100 === true){
//       for (var i = 0; i < lastScheduleinArray.length; i++) {
//         if(i >= 100){
//           await lastScheduleinArray.remove(lastScheduleinArray[i]._id);
//         }
//       }
//     }
//     this.save()
//   } catch (err) {
//     log.error(err);
//   }
// }

const Schedule = mongoose.model('Schedule', ScheduleSchema);

// Export
module.exports = Schedule;
