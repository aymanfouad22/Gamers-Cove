# 🎮 Gamers Cove Frontend - API Tester

A comprehensive frontend UI for testing all Gamers Cove API endpoints with Firebase Google Authentication.

## 🚀 Features

### Authentication
- **Google Sign-In** - One-click authentication with Gmail
- **JWT Token Management** - Automatic token refresh and inclusion in API requests
- **Visual Auth Status** - Clear indication of authentication state

### API Testing Capabilities

#### 🎮 Games
- **Get All Games** (Public) - Browse all games without authentication
- **Get Game by ID** (Public) - View specific game details
- **Import from IGDB** (Protected) - Import games from IGDB API (requires auth)

#### ⭐ Reviews
- **Get Game Reviews** (Public) - View reviews for any game
- **Create Review** (Protected) - Post new reviews (requires auth + ownership)
- **Update Review** (Protected) - Edit your own reviews (requires auth + ownership)
- **Delete Review** (Protected) - Remove your reviews (requires auth + ownership)

#### 👤 Users
- **Create User** (Public) - Register new user accounts
- **Get User by Username** (Public) - Lookup user profiles
- **Update Profile** (Protected) - Edit your own profile (requires auth + ownership)
- **Get Favorites** (Protected) - View favorite games (requires auth + ownership)

#### 👥 Friendships
- All friendship operations require authentication (not yet implemented in backend)

## 📁 Project Structure

```
frontend/
├── index.html              # Main UI
├── css/
│   └── styles.css         # Styling
└── js/
    ├── firebase-config.js # Firebase initialization
    ├── auth.js           # Authentication logic
    ├── api.js            # API request handlers
    └── app.js            # Main application logic
```

## 🛠️ Setup

### 1. Start the Backend
```bash
cd /Users/ayman/IdeaProjects/Gamers-Cove
mvn spring-boot:run
```

### 2. Serve the Frontend
You can use any static file server. Options:

**Option A: Python**
```bash
cd frontend
python3 -m http.server 8000
```

**Option B: Node.js (http-server)**
```bash
npm install -g http-server
cd frontend
http-server -p 8000
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 3. Open in Browser
```
http://localhost:8000
```

## 🔐 Authentication Flow

1. **Click "Sign in with Google"** button in header
2. **Select your Google account** in popup
3. **Grant permissions** to Gamers Cove
4. **Authenticated!** - Your profile appears in header
5. **Protected endpoints** now accessible with JWT token

## 🎯 Usage Examples

### Testing Public Endpoints (No Auth Required)

1. **Browse Games**
   - Go to "Games" tab
   - Click "Get All Games"
   - View results in console

2. **View Reviews**
   - Go to "Reviews" tab
   - Enter a game ID
   - Click "Get Reviews"

### Testing Protected Endpoints (Auth Required)

1. **Sign in first** with Google
2. **Create a Review**
   - Go to "Reviews" tab
   - Fill in User ID, Game ID, Rating, Content
   - Click "Create Review"
   - JWT token automatically included

3. **Update Profile**
   - Go to "Users" tab
   - Enter new username and bio
   - Click "Update Profile"
   - Your Firebase UID automatically used

## 🔍 Features Explained

### Visual Indicators
- 🔓 **Not Authenticated** - Red, public endpoints only
- 🔒 **Authenticated** - Green, all endpoints accessible
- 🟢 **API Online** - Green dot, backend is running
- 🔴 **API Offline** - Red dot, backend is down

### Protected Sections
- Yellow background with 🔒 icon
- Require authentication to use
- Show warning if not signed in

### Result Display
- **Green text** - Successful response
- **Red text** - Error response
- **JSON formatted** - Easy to read
- **Scrollable** - Handle large responses

### Toast Notifications
- ✅ **Success** - Green border
- ❌ **Error** - Red border
- ⚠️ **Warning** - Yellow border
- Auto-dismiss after 3 seconds

## 🐛 Troubleshooting

### "API is offline" message
- Make sure backend is running: `mvn spring-boot:run`
- Check backend is on port 8081
- Verify CORS is configured in `SecurityConfig.java`

### "Authentication required" errors
- Click "Sign in with Google" button
- Check browser console for Firebase errors
- Verify Firebase config in `firebase-config.js`

### "403 Forbidden" errors
- You're trying to access someone else's resource
- Make sure you're using your own User ID
- Check ownership validation in backend

### CORS errors
- Update `SecurityConfig.java` with your frontend URL
- Add `http://localhost:8000` to allowed origins
- Restart backend after changes

## 🎨 Customization

### Change API Base URL
Edit `js/api.js`:
```javascript
const API_BASE_URL = 'http://your-api-url:port/api';
```

### Change Firebase Config
Edit `js/firebase-config.js` with your Firebase project credentials

### Modify Styling
Edit `css/styles.css` to customize colors, fonts, layout

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "status": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 401
}
```

## 🔑 Security Notes

- JWT tokens are stored in memory (not localStorage)
- Tokens automatically refresh when expired
- All protected requests include `Authorization: Bearer <token>` header
- Firebase handles secure authentication
- Backend validates all tokens

## 📝 Testing Checklist

- [ ] Backend running on port 8081
- [ ] Frontend served on port 8000
- [ ] Can browse games without auth
- [ ] Can sign in with Google
- [ ] Profile appears after sign in
- [ ] Can create review (auth required)
- [ ] Can update own profile (auth required)
- [ ] Cannot update others' resources (403 error)
- [ ] Toast notifications working
- [ ] API status indicator accurate

## 🚀 Next Steps

1. Test all public endpoints
2. Sign in with Google
3. Test all protected endpoints
4. Try accessing others' resources (should fail)
5. Check browser console for detailed logs
6. Review backend logs for authentication events

---

**Happy Testing! 🎮✨**
