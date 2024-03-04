const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { config } = require('../config');
const { formatNumber } = require('../utils/numbers');

const createTokenDisplayEmbed = (tokenData) => {
  // Construct the embed with the provided token data
  const embed = new EmbedBuilder()
      .setColor(0x00FFFF) // Set the color
      .setTitle(`${tokenData.baseToken.symbol}/${tokenData.quoteToken.symbol} - Pair Address ${tokenData.pairAddress}`) // Set the title
      .setURL(tokenData.url) // Set the URL
      .setThumbnail(tokenData.info && tokenData.info.imageUrl ? tokenData.info.imageUrl : 'https://segensolar.co.za/wp-content/uploads/2020/11/SE-5000H-RWS-3.jpg') // Set the thumbnail
      .addFields(
        { name: 'USD:', value: `$ ${tokenData.priceUsd}`, inline: true },
        { name: 'SOL:', value: `${tokenData.priceNative} SOL`, inline: true },
        { name: 'Market Cap', value: `$ ${formatNumber(tokenData.fdv)}`, inline: true },
        {
            name: 'Volume',
            value: `5mins $ ${formatNumber(tokenData.volume.m5, true)}
              1hr $ ${formatNumber(tokenData.volume.h1, true)}
              6hr $ ${formatNumber(tokenData.volume.h6, true)}
              24hr $ ${formatNumber(tokenData.volume.h24, true)}`,
            inline: true,
        },
        {
            name: 'Txn count (buy/sell)',
            value: `5mins ${tokenData.txns.m5.buys} / ${tokenData.txns.m5.sells}
              1hr ${tokenData.txns.h1.buys} / ${tokenData.txns.h1.sells}
              6hr ${tokenData.txns.h6.buys} / ${tokenData.txns.h6.sells}
              24hr ${tokenData.txns.h24.buys} / ${tokenData.txns.h24.sells}`,
            inline: true,
        },
        {
            name: 'Links',
            value: `${tokenData.info && tokenData.info.websites ? `[Website](${tokenData.info.websites.find(site => site.label === 'Website').url})` : 'No Website'} | ${tokenData.info && tokenData.info.socials && tokenData.info.socials.find(site => site.type === 'twitter') ? `[X.com](${tokenData.info.socials.find(site => site.type === 'twitter').url})` : 'No Twitter'}`,
            inline: false,
        },
      )
      .setTimestamp()
      .setFooter({ text: 'Anti Paper Hands Club' });

  return embed;
}

exports.activateCoinCheck = async(discordClient, adminNoticeChannel) => {
  try {
    if(config.announcements.features.coinCheck){
      // notify admin that coincheck is running 
      await adminNoticeChannel.send({content: `Coin Check is running`})
    }

    discordClient.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;
  
      const { commandName, options } = interaction;
  
      // if command name is coin-check-search
      if (commandName === 'coin-check-search') {
        const symbol = options.getString('symbol');
        const fetchTokenData = await axios.get(`${config.apiEndpoints.dexScreener}/search/?q=${symbol.toUpperCase()}`)
        const tokenData = fetchTokenData.data.pairs[0]
        console.log('tokenData', tokenData)
        const embed = createTokenDisplayEmbed(tokenData);
        
        return await interaction.reply({ embeds: [embed] });
      }

      if (commandName === 'coin-check-pair-address') {
        const pairAddress = options.getString('pair-address');
        const chain = options.getString('chain');

        if (!['eth', 'bsc', 'solana'].includes(chain)) {
          // Reply or handle the error if the chain is not one of the expected values
          await interaction.reply({ content: 'Invalid chain. Please choose from eth, bsc, or solana.', ephemeral: true });
          return;
        }

        const fetchTokenData = await axios.get(`${config.apiEndpoints.dexScreener}/pairs/${chain}/${pairAddress}`)
        
        const tokenData = fetchTokenData.data.pair

        const embed = createTokenDisplayEmbed(tokenData);
        
       return await interaction.reply({ embeds: [embed] });
      }
      // Handle other commands
    });
  } catch(err) {
    console.log("Coin Check error", err)
  }
}

