const { BotClientFactory } = require('@open-ic/openchat-botclient-ts');
const Content = require('../models/Content');


const factory = new BotClientFactory({
  openchatPublicKey: process.env.OC_PUBLIC,
  icHost: process.env.IC_HOST,
  openStorageCanisterId: process.env.STORAGE_INDEX_CANISTER,
  identityPrivateKey: process.env.IDENTITY_PRIVATE,
});





class ContentScheduler {
  constructor() {
    this.isRunning = false;
    this.checkInterval = 1 * 60 * 1000; // Check every minute
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Content scheduler started');
    
    this.intervalId = setInterval(async () => {
      try {
        await this.checkAndPostContent();
      } catch (error) {
        console.error('Error in content scheduler:', error);
      }
    }, this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isRunning = false;
      console.log('Content scheduler stopped');
    }
  }

  async checkAndPostContent() {
    const now = new Date();
    console.log('Checking for content to post at:', now.toISOString());

    try {
      // Find all pending content that should be posted
      const contentToPost = await Content.find({
        status: 'pending',
        scheduledTime: { $lte: now }
      }).populate({
        path: 'campaignId',
        select: 'name apiKey status' // Include the fields we need
      });

      for (const content of contentToPost) {
        try {
          // Check if campaign exists and is active
          if (!content.campaignId) {
            console.error(`Campaign not found for content ${content._id}`);
            content.status = 'failed';
            content.lastError = 'Campaign not found';
            await content.save();
            continue;
          }
          
          if (content.campaignId.status !== 'active') {
            console.log(`Skipping content ${content._id} - campaign ${content.campaignId.name} is not active`);
            continue;
          }
          
          console.log(`Processing content ${content._id} for campaign "${content.campaignId.name}"`);
          console.log(`Using API key: ${content.campaignId.apiKey}`);

          // Here you would integrate with OpenChat API
          await this.postToOpenChat(content);
          
          // Update content status to posted
          content.status = 'posted';
          content.lastAttempt = new Date();
          content.attempts += 1;
          await content.save();
          
          console.log(`Posted content ${content._id} successfully`);
        } catch (error) {
          console.error(`Failed to post content ${content._id}:`, error);
          content.status = 'failed';
          content.lastError = error.message;
          content.lastAttempt = new Date();
          content.attempts += 1;
          await content.save();
        }
      }

    } catch (error) {
      console.error('Error checking for content to post:', error);
    }
  }

  async postToOpenChat(content) {
    return new Promise(async (resolve, reject) => {
      console.log('Would post to OpenChat with:', {
        apiKey: content.campaignId.apiKey,
        content: content.content,
        campaignName: content.campaignId.name
      });

      //create the openchat context object
      let client = factory.createClientFromApiKey(content.campaignId.apiKey);
      let resz = await client.createTextMessage(content.content);
    
      console.log("text message sending results:", resz);
      await client.sendMessage(resz)
      .catch((err) => console.error("sendMessage failed with: ", err));
      resolve();
    });
  }
}

module.exports = new ContentScheduler(); 