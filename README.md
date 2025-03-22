# Social Media Campaign Manager with AI Integration

A comprehensive social media management platform that combines campaign scheduling, AI-powered content generation, and multi-platform posting capabilities.

## 🌟 Features

### AI Chat Integration
- **PDF Context-Aware Chat**: Upload PDFs and chat with an AI that understands the document context
- **Message History**: Maintains conversation history for each chat instance
- **Export to Campaign**: Schedule AI-generated content directly to your campaigns
- **Multiple Chat Instances**: Create and manage multiple chat conversations
- **Real-time Responses**: Live chat interface with typing indicators
- **Secure API Handling**: Encrypted storage of API keys and sensitive data

### Campaign Management
- **Multi-Platform Support**: 
  - Twitter
  - Discord
  - Telegram
  - (More platforms coming soon)
- **Campaign Creation**: 
  - Create and name campaigns
  - Set platform-specific settings
  - Configure posting schedules
  - Manage API keys securely
- **Content Scheduling**:
  - Schedule posts for specific dates and times
  - Manage multiple content pieces per campaign
  - Edit scheduled content
  - Delete or reschedule posts

### Security Features
- **API Key Encryption**: 
  - AES-256-GCM encryption for API keys
  - Secure key storage in database
  - Salt-based key derivation
  - Authentication tags for data integrity
- **User Authentication**: 
  - Internet Identity integration
  - Principal-based access control
  - Secure session management

### Analytics & Monitoring

- **Campaign Analytics**:
  - Track post performance
  - View engagement metrics
  - Monitor scheduling status
- **Dashboard**:
  - Overview of all campaigns
  - Recent activity tracking
  - Quick access to common actions

## 🛠 Technical Stack

### Frontend

- React.js
- Tailwind CSS
- Axios for API calls
- React Icons
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- LangChain for AI integration
- OpenAI API
- Crypto for encryption

### AI Features
- OpenAI GPT-3.5 Turbo integration
- PDF parsing and context understanding
- Vector storage for document embeddings
- Conversation memory and context management

## 🔒 Security Measures

- Encrypted storage of API keys
- Secure environment variable management
- Input validation and sanitization
- Error handling and logging
- Rate limiting and request validation
- Secure file upload handling

## 📝 API Endpoints

### Campaign Management
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns` - Get all campaigns
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### AI Chat
- `POST /ai-chat` - Create new chat instance
- `GET /ai-chat` - Get all chat instances
- `GET /ai-chat/:id` - Get specific chat instance
- `POST /ai-chat/:id/chat` - Send message to chat
- `POST /ai-chat/:id/upload` - Upload PDF to chat
- `GET /ai-chat/:id/history` - Get chat history

### Content Management
- `POST /api/content` - Create new content
- `GET /api/content` - Get all content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   SECRET_KEY=your_secret_key
   OPENAI_API_KEY=your_openai_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔜 Upcoming Features

### Content Enhancement
- [ ] AI-powered content optimization
  - Sentiment analysis for posts
  - Hashtag recommendations
  - Best posting time suggestions
  - Engagement prediction
- [ ] Media Management
  - Image/video optimization
  - Auto-resizing for different platforms
  - Media library with tagging
  - Bulk media upload

### Advanced Analytics
- [ ] Performance Tracking
  - Real-time engagement metrics
  - A/B testing for content
  - Audience demographics analysis
  - ROI calculations
- [ ] Custom Reports
  - Automated report generation
  - Custom dashboard creation
  - Export capabilities (PDF, CSV)
  - Comparative analysis

### Automation Features
- [ ] Smart Scheduling
  - AI-powered optimal time detection
  - Queue management
  - Content recycling
  - Platform-specific timing
- [ ] Workflow Automation
  - Custom approval workflows
  - Content review cycles
  - Auto-tagging
  - Bulk operations

### Team Collaboration
- [ ] Role-Based Access Control
  - Custom roles and permissions
  - Team member management
  - Activity logging
  - Audit trails
- [ ] Collaboration Tools
  - In-app commenting
  - Content approval system
  - Team performance metrics
  - Task assignment

### Integration Capabilities
- [ ] Additional Platforms
  - LinkedIn
  - Instagram
  - TikTok
  - YouTube
- [ ] Third-party Tools
  - Google Analytics
  - CRM systems
  - Email marketing platforms
  - Custom webhook support

### Advanced Security
- [ ] Enhanced Protection
  - Two-factor authentication
  - IP whitelisting
  - Session management
  - Rate limiting
- [ ] Compliance Features
  - GDPR compliance tools
  - Data retention policies
  - Privacy policy management
  - Data export capabilities

### Content Management
- [ ] Version Control
  - Content revision history
  - Rollback capabilities
  - Draft management
  - Template system
- [ ] Content Calendar
  - Visual calendar interface
  - Drag-and-drop scheduling
  - Content categorization
  - Campaign planning tools

### AI Enhancements
- [ ] Advanced AI Features
  - Multi-language support
  - Content summarization
  - Image generation integration
  - Voice-to-text posting
- [ ] Smart Analytics
  - Predictive analytics
  - Trend detection
  - Competitor analysis
  - Content recommendations

### Platform Specific
- [ ] Twitter Features
  - Thread creation
  - Auto-reply management
  - Follower analysis
  - Trend monitoring
- [ ] Discord Features
  - Server management
  - Role-based posting
  - Channel analytics
  - Custom bot integration
- [ ] Telegram Features
  - Channel management
  - Broadcast controls
  - Member analytics
  - Custom commands

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
