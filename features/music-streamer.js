const prism = require('prism-media');
const ytdl = require('ytdl-core');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  entersState, 
  VoiceConnectionStatus, 
  AudioPlayerStatus 
} = require('@discordjs/voice');

let elapsedTime = 0; // Track elapsed time in seconds
let interval; // For updating the elapsed time
let globalVolume = 0.01;

let resource;
let connection;

// Playlists 
let predeterminedPlaylist = [
  "https://www.youtube.com/watch?v=nfKXPPMidqw",
  'https://www.youtube.com/watch?v=2uznwavqsBs', 
  'https://www.youtube.com/watch?v=dPAL7_FuQ8M', 
  "https://www.youtube.com/watch?v=hr6l6zpVDsY",
  "https://www.youtube.com/watch?v=n_LcVqqHSY8", // lane 8 sunset mix
  "https://www.youtube.com/watch?v=QtKGMfeyPUE", // diplo antartica
  "https://www.youtube.com/watch?v=zIRIvCa21gg", // rufus du sol sydney harbour
  "https://www.youtube.com/watch?v=Vh246_Mgk7o", // Deep House Forest Mix - Durante (DJ Set)

]; 
let userPlaylist = [];

let currentPlaylist = 'user'; // 'user' or 'predetermined'
let currentIndex = 0; // Track the current index of the playing song
let currentSongInfo = { url: '', title: '' }; // for displaying current song info 

// Randomly pick from the predetermined array 
function pickRandomVideo(videoArray) {
  const randomIndex = Math.floor(Math.random() * videoArray.length);
  return videoArray[randomIndex];
}

// join a channel
async function joinChannel(channelId, guildId, adapterCreator) {
  connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
    selfDeaf: false
  });
  await entersState(connection, VoiceConnectionStatus.Ready, 20e3); // Wait up to 20 seconds for the connection to become ready
  return connection;
}

async function playYouTubeAudio(url, connection, startTime = 0, message) {
  try {
    const streamOptions = { filter: 'audioonly', highWaterMark: 1 << 25 };
    if (startTime > 0) {
      streamOptions.begin = startTime * 1000; // `begin` option takes milliseconds
    }

    const stream = ytdl(url, streamOptions);
    const videoDetails = await ytdl.getBasicInfo(url);
    currentSongInfo = { url, title: videoDetails.videoDetails.title };

    if(message){
      // announce what video is playing
      message.reply(`Current video playing: ${currentSongInfo.title} \n ${currentSongInfo.url}`)
    }
    
    // create resource 
    resource = createAudioResource(stream, { inlineVolume: true });

    // set volume 
    resource.volume.volume = globalVolume;

    const player = createAudioPlayer();

    player.on('error', error => {
      console.error('Error from player:', error.message);
    });

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Playback has started.');
      // Start or reset the interval to update the elapsed time every second
      clearInterval(interval);
      interval = setInterval(() => {
        elapsedTime += 1;
      }, 1000);
    });

    player.on(AudioPlayerStatus.Idle, async () => {
      console.log('Playback has finished.');
      clearInterval(interval); // Stop updating the elapsed time
      await playNextSong(connection); // Automatically play the next song
    });

    connection.subscribe(player);
    player.play(resource);
    console.log('Audio playback should have started.');
  } catch (error) {
    console.error('Error playing YouTube audio:', error);
    connection.destroy(); // Cleanup connection if there's an error
  }
}

// 

// Play next track
async function playNextSong(connection) {
  // If the user playlist has songs, play the next song from there
  if (currentPlaylist === 'user' && userPlaylist.length > 0) {
      const nextSongUrl = userPlaylist.shift(); // Remove the first song and get its URL
      await playYouTubeAudio(nextSongUrl, connection);
      // Check if the user playlist is now empty, and switch to the predetermined playlist if it is
      if (userPlaylist.length === 0) {
          currentPlaylist = 'predetermined';
          currentIndex = 0; // Start from the beginning of the predetermined playlist
      }
  } else {
      // Safely calculate the next song's index to handle looping
      currentIndex = (currentIndex + 1) % predeterminedPlaylist.length;
      const nextSongUrl = predeterminedPlaylist[currentIndex];
      await playYouTubeAudio(nextSongUrl, connection);
  }
}

exports.startMusic = (client) => {
  client.on('messageCreate', async message => {

      // Guard clause for non-command messages or messages from the bot itself
  if (!message.content.startsWith('!') || message.author.bot) return;

  // Extract command and arguments from the message
  const args = message.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  // Ensure there's a voice channel to operate with
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel && command !== 'showPlaylist' && command !== 'currentSong') {
    return message.reply('You need to be in a voice channel to use music commands!');
  }

  connection = await joinChannel(voiceChannel.id, message.guild.id, voiceChannel.guild.voiceAdapterCreator);

  switch (command) {
    case 'help':
      handleHelpCommand(message);
      break;
    case 'play':
      handlePlayCommand(args, connection, message);
      break;
    case 'stop':
      handleStopCommand(connection, message);
      break;
    case 'volume':
      handleVolumeCommand(args, message);
      break;
    case 'skip':
      handleSkipCommand(connection, message);
      break;
    case 'addtoplaylist':
      handleAddToPlaylistCommand(args, connection, message);
      break;
    case 'clearplaylist':
      handleClearPlaylistCommand(message);
      break;
    case 'currentvideo':
      handleCurrentSongCommand(message);
      break;
    case 'showplaylist':
      handleShowPlaylistCommand(message);
      break;
    default:
      message.reply("I don't recognize that command.");
  }
  });
}

function handleHelpCommand(message) {
  const helpMessage = `
Here are the commands you can use:
- **!play [YouTube URL]**: Plays the audio from a YouTube video. If there's something playing, it adds to the user playlist.
- **!stop**: Stops playing and disconnects from voice channel.
- **!volume [0-1]**: Sets the volume. Use values between 0 (mute) and 1 (maximum volume).
- **!skip**: Skips to the next video in the playlist. If the user playlist is empty, it continues with the predetermined playlist.
- **!addtoplaylist [YouTube URL]**: Adds a video to the user controlled playlist. If no video is currently playing from the user playlist, it starts playing immediately.
- **!clearplaylist**: Clears all videos from the user controlled playlist.
- **!currentvideo**: Displays information about the currently playing video.
- **!showplaylist**: Shows the current videos in the user playlist. If empty, it will prompt you to add videos.
- **!help**: Shows this help message.

Remember, you need to be in a voice channel to use these commands!
`;

  message.reply(helpMessage);
}

async function handlePlayCommand(args, connection, message) {
  const url = args[0];
  if (!url || !ytdl.validateURL(url)) {
    return playYouTubeAudio(pickRandomVideo(predeterminedPlaylist), connection, message);
  }
  playYouTubeAudio(url, connection, message);
  message.reply('Now playing your requested video!');
}

function handleStopCommand(connection, message) {
  if (connection && connection.state.status !== VoiceConnectionStatus.Disconnected) {
    const player = connection.state.subscription.player;
    player.stop(); // Stop the current playing track
    connection.destroy(); // Disconnects from the voice channel
    message.reply('Playback stopped and bot has left the voice channel.');

    // Optionally, reset playback-related variables
    currentIndex = 0;
    currentPlaylist = 'user'; // or 'predetermined', based on your preference
  } else {
    message.reply('The bot is not connected to a voice channel.');
  }
}

function handleVolumeCommand(args, message) {
  const volume = parseFloat(args[0]);
  if (!isNaN(volume) && volume >= 0 && volume <= 1) {
    globalVolume = volume;
    resource.volume.setVolume(volume);
    message.reply(`Volume set to ${volume * 100}%`);
  } else {
    message.reply('Please provide a volume level between 0 and 1.');
  }
}

function handleSkipCommand(connection, message) {
  // This simply advances to the next song
  playNextSong(connection)
    .then(() => message.reply(`
      Skipping to the next video... \n\nPlaying ${currentSongInfo.title} \n\n${currentSongInfo.url}
    `))
    .catch(error => {
      console.error('Error during skip:', error);
      message.reply('There was an error trying to skip to the next song.');
    });
}

function handleAddToPlaylistCommand(args, connection, message) {
  const url = args[0];
  userPlaylist.push(url);
  message.reply('Video added to the playlist.');
  if (userPlaylist.length === 1) {
    currentPlaylist = 'user';
    currentIndex = 0;
    playNextSong(connection);
  }
}

function handleClearPlaylistCommand(message) {
  userPlaylist = []; // Clears the user playlist
  message.reply('The user playlist has been cleared.');
}

function handleCurrentSongCommand(message) {
  if (currentSongInfo.url) {
    const replyMessage = currentSongInfo.title ? `Current video playing: ${currentSongInfo.title} \n ${currentSongInfo.url}` : `Current video URL: ${currentSongInfo.url}`;
    message.reply(replyMessage);
  } else {
    message.reply('No video is currently playing.');
  }
}

function handleShowPlaylistCommand(message) {
  if (userPlaylist.length === 0) {
    message.reply('The user playlist is currently empty, add to the user playlist using !addToPlaylist [youtube link to your video].');
  } else {
    let playlistMessage = 'User Playlist:\n';
    userPlaylist.forEach((url, index) => {
      playlistMessage += `${index + 1}: ${url}\n`;
    });
    message.reply(playlistMessage);
  }
}