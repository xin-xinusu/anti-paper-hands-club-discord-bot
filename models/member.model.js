const mongoose = require('mongoose');
const db = require('.');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const MemberSchema = mongoose.Schema({
  discordId: {unique: true, type: String},
  joinedTimestamp: Date,
  premiumSinceTimestamp: Date,
  nickname: String,
  pending: Boolean,
  communicationDisabledUntilTimestamp: Date,
  discriminator: String,
  username: String,
  userId: String,
  avatar: String,
  displayName: String,
  roles: [{
    type: String
    // mongoose.Schema.Types.ObjectId,
    // ref: "Role"
  }],
  authReceipt: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthReceipt"
  }],
  avatarURL: String,
  displayAvatarURL: String,
  guilds: [{
      isPresent: { type: Boolean, default: false },
      guild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guild"
      }
  }],
  serverGuest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServerGuest"
  }],
  visa: {
  }
}, {
  timestamps: true
});


MemberSchema.pre("save", async function(next) {
  const member = this;
  console.log('memberhhs', member)
  let guildDb = await db.Guild.findOne({guildId: member.guilds[0].guild.guildId});

  if(guildDb){
    guildDb.members = [
      this,
      ...guildDb.members.map((item) => item)
    ]

    console.log('guildDb', guildDb)

    await guildDb.save()

  }
  var roles = []

  // await member.roles.forEach(async (roleId, i) => {
  //   const role = await db.Role.findOne({roleId: roleId});
  //
  //   if(role){
  //     roles.push(role._id);
  //   } else {
  //     const newRole = await db.Role.create(roleId)
  //     roles.push(newRol.id)
  //   }
  // });
  // member.roles = roles;


  next();
});

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

const Member = mongoose.model('Member', MemberSchema);

// Export
module.exports = Member;
