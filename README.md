# Mehfil Artsfest Leaderboard

A leaderboard application for Mehfil Artsfest events.

## Setup Instructions

1. Create a Firebase project at https://console.firebase.google.com/
2. Copy your Firebase project credentials
3. Create a `.env` file in the root directory with your Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Development

To run the application locally:
```bash
npm install
npm start
```

## Deployment

The application is configured for deployment to Vercel. Make sure to set the environment variables in your Vercel project settings.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Environment Variables

For security, all Firebase credentials should be stored as environment variables rather than hardcoded."# mehfil" 
