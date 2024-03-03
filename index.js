require('dotenv').config();

const { Client, ChannelType, Events, GatewayIntentBits, Partials, MessageActionRow, MessageButton, MessageEmbed, GuildChannelManager } = require('discord.js');
const express = require('express')
const app = express();
const runningPort = process.env.PORT;

const { config } = require('./config');
const { runServer } = require('./operations');

// DISCORD BOT INVITE 
// https://discord.com/oauth2/authorize?client_id=1213846334856232991&permissions=2148756560&scope=bot

// // Discord Client
let discordClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction
	],
	restTimeOffset: 1000
})

// Discord Client
discordClient.once('ready', async () => {
	try {

		// Set up according to environment
		if (config.mode === 'production') {

			// Log environment details
			log.info(`Running Production Environment`);

			// Set the production DB
			// db.setDatabase("production");
			// setLoggingDb("production");

			// Set Agenda - used when scheduling tasks
			// agenda = await new Agenda({db: { address: process.env.process.env.DISCORD_BOT_LIVE, collection: 'schedule' }});

		} else if(config.mode === 'development'){
			// Log environment details
			// log.info(`Running Development Environment`);
			console.log('config.mode', config.mode)

			// Set the development DB
			await db.setDatabase('development');

			// Logging DB
			// setLoggingDb("development");

			// Set Agenda - used when scheduling tasks
			// agenda = await new Agenda({db: { address: process.env.DISCORD_BOT_TEST, collection: 'schedule' }});
		}

		runServer(discordClient, config)

	} catch(err){
		console.log('error Root - index.js', err)
	}
})

// Handle Disconnections
discordClient.on(Events.ShardError, error => {
	console.error('A websocket connection encountered an error:', error);

	// Reestablish client
	discordClient = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
		partials: [
			Partials.Message,
			Partials.Channel,
			Partials.Reaction
		],
		restTimeOffset: 1000
	})

	runServer(discordClient, config)
});

discordClient.on(Events.ShardResume, async() => {

	// Reestablish client
	discordClient = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
		partials: [
			Partials.Message,
			Partials.Channel,
			Partials.Reaction
		],
		restTimeOffset: 1000
	})

  runServer(discordClient, config)
})



app.listen(runningPort, () => {
  console.log(`${config.botName} Service running on PORT: ${ runningPort }`)
})

//must be last line
discordClient.login(process.env.DISCORD_TOKEN);
