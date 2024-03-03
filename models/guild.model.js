const mongoose = require('mongoose');
const db = require('.');

const { serverStartup } = require('../features/server');
// const bcrypt = require('bcrypt');
// var log = require('../util/logger');

const GuildSchema = mongoose.Schema({
  memberCount: {
    defaults: {
      channelTitle: { type: String, default: "MEMBERS"},
      channelPrefix: { type: String, default: '👥⎜'}
    },
    isActive: {
      type: Boolean,
      default: false
    },
    bots: Number,
    humans: Number,
    total: Number,
    channel: {
      channelId: { type: String, default: null },
      channelTitle: { type: String, default: null },
      channelPrefix: { type: String, default: null }
    },
  },
  name: { type: String, default: null },
  bot: {
    name: {
      shouldSet: { type: Boolean, default: false },
      botName: {type: String, default: 'AUTOBOT' },
      hasSet: { type: Boolean, default: false }
    },
    profilePicture: {
      shouldSet: { type: Boolean, default: false },
      url: { type: String, default: 'https://res.cloudinary.com/exohape/image/upload/v1666357135/Branding/Bots/exobot.png' },
      hasSet: { type: Boolean, default: false }
    },
    noticeChannels: {
      adminNotices: {
        channelId: { type: String, default: null},
        channelTitle: { type: String, default: null},
        noticeType: { type: Number, default: 0 }
      },
      welcomeNotices: {
        channelId: { type: String, default: null},
        channelTitle: { type: String, default: null},
        noticeType: { type: Number, default: 0 }
      },
      communityNotices: {
        channelId: { type: String, default: null},
        channelTitle: { type: String, default: null},
        noticeType: { type: Number, default: 0 }
      }
    }
  },
  communityActivities: {
    qotd: {
      count: {
        type: Number,
        default: 1
      },
      history: [
        {
          count: Number,
          message: {
            channelId: String,
            content: String,
            messageId: String
          },
          // qotd: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: "QOTD"
          // },
          // responses: [{
          //   user: {
          //     type: mongoose.Schema.Types.ObjectId,
          //     ref: "Member"
          //   },
          //   message: {
          //     content: String,
          //     messageId: String
          //   }
          // }]
        }
      ]
    }
  },
  guildId: { type: String, unique: true, required: true },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  }],
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }],
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel"
  }],
  logsHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Log"
  }],
  authSettings: {
    userTools: {category: {name: String, categoryId: String},channel: {name: String, ChannelId: String}},
    unverified: {category: {name: String, categoryId: String},channel: {name: String, ChannelId: String}},
  },
  settings: {
    usersMenu: {
      channelId: { type: String, default: null },
      channelTitle: { type: String, default: null }
    },
    dj: {
      channelId: { type: String, default: null },
      isActive: {
        type: Boolean,
        default: false
      },
      settings: {
        volume: {type: Number, default: 0.02}
      },
      djBag: {
          sourceType: { type: String, default: "radio" },
          mediaId: { type: String }
      }
    }
    }
  },
  immigration: {
    isActive: { type: Boolean, default: true },
    visaRequired: { type: Boolean, default: false },
    notifications: {
      admin: {
        entry: {
          channel: { channelId: String },
          isActive: { type: Boolean, default: true },
          messages: [{ type: String, default: 'Welcome' }],
          entryType: {type: Number, default: 0}
        },
        exit: {
          channel: { channelId: String },
          isActive: { type: Boolean, default: true },
          messages: [{ type: String, default: 'bye' }],
          exitType: {type: Number, default: 0}
        }
      },
      community: {
        entry: {
          channel: { channelId: String },
          isActive: { type: Boolean, default: true },
          messages: [{ type: String, default: 'Welcome' }],
          entryType: {type: Number, default: 0}
        },
        exit: {
          channel: { channelId: String },
          isActive: { type: Boolean, default: true },
          messages: [{ type: String, default: 'bye' }],
          exitType: {type: Number, default: 0}
        }
      }
    },
    allowedBots: [{
      userId: String
    }]
  },
  receptionist: {
    categoryChannel: {
      channelId: { type: String, default: null },
      channelTitle: { type: String, default: null },
    },
    defaults: {
      message: { type: String, default: '**__Why you here?__** \n1. Interviews / as a potential team member \n2. 3rd party service provider meetings \n3. Team meetings \n \n**__What to do__** \nPlease select an action that best suits your purpose from the options below' },
      doesGreetVisitors: { type: Boolean, default: false},
      includeServerName: { type: Boolean, default: true},
      categoryChannelTitle: { type: String, default: 'Reception' },
      welcomeChannelTitle: { type: String, default: '👋⎜welcome' },
      lobbyChannelTitle: { type: String, default: 'Lobby' },
      word: { type: String, default: 'Welcome to' },
      welcomeImage: { type: String, default: null }
    },
    channel: {
      channelTitle: { type: String, default: "Lobby" },
      channelId: { type: String, default: null }
    },
    isActive: {
      type: Boolean,
      default: false
    },
    message: {
      messageId: { type: String, default: null },
      content: { type: String, default: null },
      welcomeImage: {
        messageId: { type: String, default: null },
        content: { type: String, default: null }
      },
    },
    lobby: {
      isActive: {
        type: Boolean,
        default: false
      },
      channel: {
        channelId: {
          type: String,
          default: null,
        },
        channelTitle: {
          type: String,
          default: null,
        }
      },
      parentId: String,
      music: {
        isActive: {
          type: Boolean,
          default: false
        },
        settings: {
          volume: {type: Number, default: 0.02}
        },
        djBag: {
            sourceType: { type: String, default: "radio" },
            mediaId: { type: String }
        }
      }
    },
    serverGuests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServerGuest"
    }]
  },
  tickets: [

  ],
  full: {
    name: String,
    icon: String,
    available: Boolean,
    shardId: Number,
    splash: String,
    banner: String,
    description: String,
    verificationLevel: String,
    vanityURLCode: String,
    discoverySplash: String,
    memberCount: Number,
    large: Boolean,
    premiumProgressBarEnabled: Boolean,
    applicationId: String,
    afkTimeout: String,
    afkChannelId: String,
    systemChannelId: String,
    premiumTier: String,
    premiumSubscriptionCount: Number,
    explicitContentFilter: String,
    mfaLevel: String,
    joinedTimestamp: Date,
    defaultMessageNotifications: String,
    maximumMembers: Number,
    maximumPresences: String,
    approximateMemberCount: String,
    approximatePresenceCount: String,
    vanityURLUses: String,
    rulesChannelId: String,
    publicUpdatesChannelId: String,
    preferredLocale: String,
    ownerId: String,
  }
}, {
  timestamps: true
});

const Guild = mongoose.model('Guild', GuildSchema);

// Export
module.exports = Guild;
