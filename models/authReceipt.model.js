const mongoose = require('mongoose');
const db = require('./');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const AuthReceiptSchema = mongoose.Schema({
  receipt: String,
  channelId: String,
  channelName: String,
  guildId: String,
  userId: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },
  createdAt: {type: Date, expires: 300}
}, {
  timestamps: true
});

AuthReceiptSchema.post('save', async(doc, next) => {
  try {
    let data = await db.Member
      .findOneAndUpdate({ _id: doc.member }, { $push: { authReceipt: doc._id }});

      console.log('data.username', data)
  } catch (error) {
    console.log("get -> error", error);
    next(error);
  }
})

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

// AuthReceiptSchema.pre("save", async function(next) {
//     var member = this;
//     var roles = []
//
// console.log('memberRoles', member.roles)
//     await member.roles.forEach(async (roleId, i) => {
//       const role = await db.Role.findOne({roleId: roleId});
//
//       if(role){
//         roles.push(role._id);
//       } else {
//         const newRole = await db.Role.create(roleId)
//         roles.push(newRol.id)
//       }
//     });
//     member.roles = roles;
//     next();
// });

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

const AuthReceipt = mongoose.model('AuthReceipt', AuthReceiptSchema);

// Export
module.exports = AuthReceipt;
