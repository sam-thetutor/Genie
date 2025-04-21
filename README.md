# Genie - Social Media Management Platform

Genie is an AI-powered social media management platform that helps you manage and automate your social media presence across multiple platforms.

## Features

- **Cross-Platform Integration**
  - Telegram integration with username filtering
  - Discord channel monitoring
  - Twitter feed monitoring (coming soon)

- **AI Chat**
  - Chat with AI about your uploaded documents
  - Get intelligent responses based on your content
  - Document analysis and insights

- **Content Scheduling**
  - Schedule posts across multiple platforms
  - Manage content calendar
  - Preview scheduled content

- **Analytics**
  - Track engagement metrics
  - Monitor performance across platforms
  - Generate insights reports

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Shadcn/ui Components
- Internet Identity Authentication

### Backend
- Node.js
- Express
- MongoDB
- Telegram Bot API
- Discord Bot API
- OpenChat Integration

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Telegram Bot Token
- Discord Bot Token
- OpenChat API Key

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
DISCORD_BOT_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
OC_PUBLIC=your_openchat_public_key
IC_HOST=your_ic_host
STORAGE_INDEX_CANISTER=your_storage_canister_id
IDENTITY_PRIVATE=your_identity_private_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/genie.git
cd genie
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

## Usage

1. Connect your wallet using Internet Identity
2. Set up your social media routes:
   - Add Telegram groups/channels
   - Configure Discord channels
   - Set up Twitter monitoring
3. Schedule content or enable automatic forwarding
4. Monitor analytics and engagement

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenChat for providing the chat infrastructure
- Internet Computer for decentralized identity management
- Shadcn/ui for the beautiful component library

## Environment Setup

1. Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

2. Update the `.env` file with your actual values:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
DISCORD_BOT_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
OC_PUBLIC=your_openchat_public_key
IC_HOST=your_ic_host
STORAGE_INDEX_CANISTER=your_storage_canister_id
IDENTITY_PRIVATE=your_identity_private_key
```

⚠️ Never commit the actual `.env` file with real credentials to version control!
