const OpenAI = require('openai');
const PostingPattern = require('../models/PostingPattern');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateContent = async (req, res) => {
  try {
    const { prompt, userId, platform, channelId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Get user's posting pattern
    const pattern = await PostingPattern.findOne({
      userId,
      platform,
      channelId
    });

    // Build system message using learned patterns
    let systemMessage = "You are a content creator assistant.";
    if (pattern) {
      systemMessage += `\nMatch these patterns:
        - Writing style: ${pattern.patterns.formality}
        - Average length: ${Math.round(pattern.patterns.averageLength)} words
        - Emoji usage: ${pattern.patterns.emojiUsage.size > 0 ? 'Yes' : 'No'}
        - Hashtag usage: ${pattern.patterns.hashtagUsage.length > 0 ? 'Yes' : 'No'}
        - Common topics: ${pattern.patterns.topics.map(t => t.name).join(', ')}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
    });

    const generatedContent = completion.choices[0].message.content.trim();
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
}; 