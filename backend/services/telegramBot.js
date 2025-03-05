const TelegramBot = require('node-telegram-bot-api');
const Route = require('../models/Route');
const { BotClientFactory } = require('@open-ic/openchat-botclient-ts');

class TelegramBotService {
  constructor() {
    this.bot = null;
  }

  async start() {
    if (this.bot) return;

    try {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
        polling: true,
        webHook: false,
        onlyFirstMatch: false
      });
      console.log('Telegram bot started');

      const botInfo = await this.bot.getMe();
      console.log('Bot info:', botInfo);
      this.botId = botInfo.id;

      this.bot.on('new_chat_members', async (msg) => {
        try {
          const newMembers = msg.new_chat_members;
          if (newMembers.some(member => member.id === this.botId)) {
            console.log(`Bot was added to group: ${msg.chat.title} (${msg.chat.id})`);
            await this.handleBotAddedToGroup(msg.chat);
          }
        } catch (error) {
          console.error('Error handling bot addition to group:', error);
        }
      });

      this.bot.on('message', async (msg) => {
        try {
          console.log('New message received:', {
            chatId: msg.chat.id,
            chatTitle: msg.chat.title,
            chatType: msg.chat.type,
            from: msg.from,
            messageText: msg.text || msg.caption
          });
          
          if (['group', 'supergroup', 'channel'].includes(msg.chat.type)) {
            await this.handleMessage(msg);
          }
        } catch (error) {
          console.error('Error handling Telegram message:', error);
        }
      });

      this.bot.on('error', (error) => {
        console.error('Telegram bot error:', error);
      });

      this.bot.on('polling_error', (error) => {
        console.error('Telegram bot polling error:', error);
      });

    } catch (error) {
      console.error('Failed to start Telegram bot:', error);
    }
  }

  async handleBotAddedToGroup(chat) {
    try {
      const chatInfo = await this.bot.getChat(chat.id);
      console.log('Chat info:', chatInfo);
      
      const botMember = await this.bot.getChatMember(chat.id, this.botId);
      const isAdmin = ['administrator', 'creator'].includes(botMember.status);
      
      await this.bot.sendMessage(chat.id, 
        `Hello! I've been added to ${chat.title}.\n` +
        `Group ID: ${chat.id}\n` +
        `Bot admin status: ${isAdmin ? '✅' : '❌'}\n\n` +
        (isAdmin ? 
          'I am an admin and can monitor messages.' : 
          'Please make me an admin so I can monitor messages.')
      );
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  }

  async handleMessage(msg) {
    console.log('Full message object:', JSON.stringify(msg, null, 2));
    
    console.log("Incoming message:", {
      chatId: msg.chat.id,
      chatType: msg.chat.type,
      messageType: msg.text ? 'text' : msg.caption ? 'media_with_caption' : 'other',
      content: msg.text || msg.caption || 'no text content'
    });
    const channelId = msg.chat.id.toString();
    
    const routes = await Route.find({
      platform: 'telegram',
      sourceId: channelId,
      status: 'active'
    });

    console.log(`Found ${routes.length} active routes for channel ${channelId}`);

    if (routes.length === 0) {
      console.log(`No active routes found for channel ${channelId}`);
      return;
    }

    for (const route of routes) {
      try {
        console.log(`Forwarding message to OpenChat for route ${route._id}`);
        await this.forwardToOpenChat(msg, route);
        
        route.lastSync = new Date();
        route.lastError = null;
        route.errorCount = 0;
        await route.save();
        console.log(`Successfully forwarded message for route ${route._id}`);

      } catch (error) {
        console.error(`Failed to forward message for route ${route._id}:`, error);
        route.lastError = error.message;
        route.errorCount += 1;
        await route.save();
      }
    }
  }

  async forwardToOpenChat(msg, route) {

    const factory = new BotClientFactory({
      openchatPublicKey: process.env.OC_PUBLIC,
      icHost: process.env.IC_HOST,
      openStorageCanisterId: process.env.STORAGE_INDEX_CANISTER,
      identityPrivateKey: process.env.IDENTITY_PRIVATE,
    })


    const client = factory.createClientFromApiKey(route.openchatApiKey);

    let content = '';
    if (msg.text) {
      content = msg.text;
    } else if (msg.caption) {
      content = msg.caption;
    }

    if (!content) {
      console.log('Skipping message without text content');
      return;
    }

    if (route.filters) {
      if (!route.filters.includeLinks && content.includes('http')) {
        return;
      }
      if (route.filters.keywords && route.filters.keywords.length > 0) {
        const hasKeyword = route.filters.keywords.some(keyword => 
          content.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!hasKeyword) {
          return;
        }
      }
    }

    const message = await client.createTextMessage(content);
    await client.sendMessage(message);
  }

  stop() {
    if (this.bot) {
      this.bot.stopPolling();
      this.bot = null;
      console.log('Telegram bot stopped');
    }
  }
}

module.exports = new TelegramBotService(); 