# Gamers Cove 🎮

A comprehensive fandom website project about games featuring AI chatbot integration and an AI mini-gameEntity engine.

## 🚀 Features

- **Game Database**: Comprehensive gameEntity information, reviews, and ratings
- **User Management**: User profiles, favorites, and wishlists
- **Review System**: User-generated reviews with pros/cons and helpful voting
- **Comment System**: Nested comments on games and reviews
- **AI Chatbot**: Intelligent gaming assistant for userEntity queries
- **AI Mini-Game Engine**: Interactive AI-powered mini-games
- **Modern UI**: Responsive design with beautiful gaming aesthetics

## 🏗️ Project Structure

```
Gamers_Cove/
├── frontend/                 # React frontend application
│   ├── pages/               # Page components
│   ├── components/          # Reusable UI components
│   ├── assets/             # Images, CSS, icons
│   ├── utils/              # Helper functions
│   ├── services/           # API calls
│   └── tests/              # Frontend tests
├── backend/                 # Node.js/Express backend
│   ├── api/                # API endpoints
│   ├── database/           # Database schemas & migrations
│   ├── models/             # Data models
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth, validation, error handling
│   ├── config/             # Configuration files
│   ├── services/           # AI services
│   └── tests/              # Backend tests
├── docs/                   # Documentation
└── tests/                  # Integration tests
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **OpenAI API** for AI features
- **bcrypt** for password hashing

### Frontend
- **React.js** with modern hooks
- **CSS3** with responsive design
- **Axios** for API communication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- OpenAI API key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aymanfouad22/Gamers_Cove.git
   cd Gamers_Cove
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm start
   ```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gamers_cove

# JWT
JWT_SECRET=your_jwt_secret_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests only
npm run test:frontend

# Backend tests only
npm run test:backend
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get userEntity profile

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get gameEntity by ID
- `POST /api/games` - Create new gameEntity (admin only)

### Reviews
- `GET /api/reviews/gameEntity/:gameId` - Get reviews for a gameEntity
- `POST /api/reviews` - Create a review
- `PUT /api/reviews/:id` - Update a review

### Comments
- `GET /api/comments/gameEntity/:gameId` - Get comments for a gameEntity
- `POST /api/comments` - Create a comment
- `PUT /api/comments/:id` - Update a comment

## 🤖 AI Features

### AI Chatbot
- Gaming recommendations
- Game information queries
- Technical support
- Community guidelines

### AI Mini-Game Engine
- Text-based adventures
- Puzzle generation
- Interactive storytelling
- Dynamic difficulty adjustment

## 📱 Pages

- **Home**: Featured games, latest reviews, community highlights
- **Game List**: Browse all games with filters and search
- **Game Details**: Comprehensive gameEntity information, reviews, and comments
- **User Profile**: Personal dashboard, favorites, and activity

## 🎨 Components

- **Game Card**: Game preview with rating and quick actions
- **Review Section**: User reviews with helpful voting
- **Comment Box**: Interactive commenting system
- **Navbar**: Navigation and userEntity menu
- **Common**: Reusable UI elements

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 📈 Performance

- Database indexing for fast queries
- Efficient API endpoints
- Optimized database queries
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ayman Fouad**
- GitHub: [@aymanfouad22](https://github.com/aymanfouad22)

## 🙏 Acknowledgments

- Gaming community for inspiration
- OpenAI for AI capabilities
- Open source community for tools and libraries

---

**Happy Gaming! 🎮✨** 