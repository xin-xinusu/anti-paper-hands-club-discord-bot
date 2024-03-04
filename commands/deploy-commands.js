require('dotenv').config()

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { config } = require('../config.js');

const commands = [
    {
        name: 'coin-check-search',
        description: 'Fetch the latest price and details about your favourite crypto currency',
        options: [
          {
            name: 'symbol',
            type: 3, // Numerical value for the STRING type
            description: 'Token pair symbol search',
            required: true,
          }
      ],
    },
    {
      name: 'coin-check-pair-address',
      description: 'Fetch the latest price and details about your favourite crypto currency',
      options: [
        {
          name: "chain",
          type: 3, // STRING type
          description: "Chain name",
          required: true,
          choices: [
            {
              "name": "Ethereum",
              "value": "eth"
            },
            {
              "name": "Binance Smart Chain",
              "value": "bsc"
            },
            {
              "name": "Solana",
              "value": "solana"
            }
          ]
        },
        {
          name: 'pair-address',
          type: 3, // Numerical value for the STRING type
          description: 'Pair Address search',
          required: true,
        }
      ],
    }
    
    // Add more commands here
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.botId, config.guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();