# Gamers Cove Frontend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Register a new web app in your Firebase project
   - Copy the configuration object provided by Firebase

3. **Create Local Configuration**
   ```bash
   # Copy the example config file
   cp js/config.example.js js/config.js
   ```
   - Open `js/config.js` and replace the mock values with your Firebase project's credentials

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

- `js/` - All JavaScript source files
  - `config.js` - Firebase configuration (create this file from the example)
  - `app.js` - Main application logic
  - `auth.js` - Authentication handlers
  - `api.js` - API communication
- `css/` - Stylesheets
- `index.html` - Main entry point

## Important Notes

- **Never commit your actual Firebase credentials** to version control
- The `.gitignore` is configured to prevent committing sensitive files
- If you accidentally commit sensitive information, rotate your Firebase credentials immediately

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
