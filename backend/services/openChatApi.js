const axios = require('axios');

class OpenChatApi {
  constructor() {
    this.baseUrl = 'https://api.openchat.com/v1'; // Replace with actual API URL
  }

  async postMessage(apiKey, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        { content: message },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('OpenChat API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new OpenChatApi(); 