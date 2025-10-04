# 🎮 Gamers Cove

A comprehensive gaming platform with user authentication, game database, and review system.

## 🚀 Features

- **Game Database**: Comprehensive game information and details
- **User Authentication**: Secure sign-in with Google
- **Review System**: User-generated reviews and ratings
- **Modern UI**: Responsive design with a clean interface
- **RESTful API**: Fully documented endpoints for integration

## 🏗️ Tech Stack

### Backend (Spring Boot)
- **Java 17** with **Spring Boot 3.x**
- **PostgreSQL** for data persistence
- **Spring Security** with JWT authentication
- **Hibernate** ORM
- **Maven** for dependency management

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Firebase Authentication**
- **Fetch API** for backend communication
- **Responsive Design** for all devices

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ (for frontend)
- PostgreSQL 13+
- Firebase project (for authentication)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gamers-cove.git
   cd gamers-cove
   ```

2. **Configure database**
   - Create a PostgreSQL database
   - Update `application.properties` with your database credentials

3. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project
   - Add your Firebase config in `firebase-config.js`
   - Enable Google Sign-In in Firebase Console

3. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gamerscove
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION_MS=86400000

# Frontend
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI (JSON): `http://localhost:8080/v3/api-docs`

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Firebase](https://firebase.google.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Maven](https://maven.apache.org/)
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