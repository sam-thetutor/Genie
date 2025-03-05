const { BotClientFactory } = require('@open-ic/openchat-botclient-ts');

class OpenChatService {
  constructor() {
    this.factory = new BotClientFactory({
      openchatPublicKey: process.env.OC_PUBLIC,
      icHost: process.env.IC_HOST,
      openStorageCanisterId: process.env.STORAGE_INDEX_CANISTER,
      identityPrivateKey: process.env.IDENTITY_PRIVATE,
    });
  }

  async sendMessage(apiKey, groupId, content) {
    try {
      const client = this.factory.createClientFromApiKey(apiKey);
      // await client.connect();
      // await client.setCurrentGroup(groupId);

      const message = await client.createTextMessage(content);
      let response = await client.sendMessage(message);
      console.log('Message sent response :',response);
    } catch (error) {
      console.error('OpenChat API error:', error);
      throw new Error(`OpenChat API error: ${error.message}`);
    }
  }
}

module.exports = new OpenChatService(); 