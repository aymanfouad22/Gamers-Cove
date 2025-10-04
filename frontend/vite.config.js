import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    root: './',
    publicDir: 'public',
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './js'),
      },
    },
    define: {
      'process.env': {
        VITE_FIREBASE_API_KEY: JSON.stringify(env.VITE_FIREBASE_API_KEY),
        VITE_FIREBASE_AUTH_DOMAIN: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
        VITE_FIREBASE_PROJECT_ID: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
        VITE_FIREBASE_STORAGE_BUCKET: JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
        VITE_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
        VITE_FIREBASE_APP_ID: JSON.stringify(env.VITE_FIREBASE_APP_ID),
        VITE_FIREBASE_MEASUREMENT_ID: JSON.stringify(env.VITE_FIREBASE_MEASUREMENT_ID),
      }
    }
  };
});
