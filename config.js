exports.config = {
  botName: "Anti Bot | APHC", // name of the bot 
  botId: '1213846334856232991',
  guildId: "1211709515037155412", // main guild the bot is to run in - usually only for testing
  adminNotices: "1213854921829519391", // channel used to post messages to admins

  announcements: {
    start: false, // announce once bot starts running
    features: {
      coinCheck: false, //anounce when feature is running
    }
  },

  // Features 
  coinCheck: {
    isActive: true,
  }, 
  music: {
    isActive: true
  },


  apiEndpoints: { //baseApi endpoints for services
    dexScreener: "https://api.dexscreener.com/latest/dex" //dex screener
  }
}