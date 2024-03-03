const db = require('../models')

exports.fetchAllMembers = async(guild) => {
  return await guild.members.fetch()
}

exports.guildDoorCheck = async (dbGuild, memberDb, member, isLeaving) => {
  let memberUser;
  // check if member is in GuildDb member list already
  const isInGuildDb = await dbGuild.members.find(dbM => dbM.discordId === member.user.id);
  if(!isInGuildDb){
    // Update/Create Member - if not in db
    if(!memberDb){
      // Format member for saving into db
      memberUser = {
        guilds: {isPresent: true, guild: dbGuild},
        discordId: member.user.id,
        ...member.user,
        ...member,
        user: null,
        id: null
      }
      memberDb = await db.Member.create(memberUser)
    } else {
      memberDb = await db.Member.findOneAndUpdate(
        { discordId: member.user.id },
        { $set: { "guilds": { guild: dbGuild, isPresent: true }}},
        { new: true }
      )
    }

    // Update Guild with new members list
    dbGuild = db.Guild.findOneAndUpdate(
      { discordId: memberDb.discordId },
      { $set: { "members": { memberDb }}},
      { new: true }
    )

    return memberDb
  } else {
    // If member is already in db - update their present in guild
    return await db.Member.findOneAndUpdate(
      { discordId: isInGuildDb.discordId },
      { $set: { "guilds": { guild: dbGuild, isPresent: isLeaving ? false : true }}},
      { new: true }
    )
  }
}

exports.countServerMembers = async(guild) => {
  const guildMembers = await guild.members.fetch()
  try {
    return {
      bots: guildMembers.reduce((count, member) => {
        if (member.user.bot) {
          return count + 1;
        }
        return count;
      }, 0),
      humans: guildMembers.reduce((count, member) => {
        if(!member.user.bot) {
          return count + 1;
        }
        return count;
      }, 0),
      total: guildMembers.reduce((count, member) => {
        return count + 1;
      }, 0)
    }
  } catch (err) {
    console.log('An err occured while counting members', err)
    return null
  }
}
