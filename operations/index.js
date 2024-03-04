const { config } = require('../config')
const { activateCoinCheck } = require('../features/coin-price-data')

const adminNotifications = config.adminNotices || null

exports.runServer = async(discordClient, config) => {
	const guild = await discordClient.guilds.fetch(config.guildId)
	const guilds = await discordClient.guilds.fetch()

	console.log('Bot running & active');

	// define adminNoticeChannel
	const adminNoticeChannel = await discordClient.channels.fetch(config.adminNotices)

	// Announce
	config.announcements.start
		? await adminNoticeChannel.send({content: `${config.botName} reporting for service 🫡`})
		: null


  // Coin Check - use commands to get the latest coin information

  if(config.coinCheck.isActive) {
    activateCoinCheck(discordClient, adminNoticeChannel)
  }
    
}
