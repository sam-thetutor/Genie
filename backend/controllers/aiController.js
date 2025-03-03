const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator. Create engaging, concise content suitable for social media posts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content.trim();
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
}; 