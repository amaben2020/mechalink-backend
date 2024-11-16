import firebase, { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import admin from 'firebase-admin';
// import config from './firebaseService.json' assert { type: 'json' };
const config = await import('./firebaseService.json');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(config as any),
});

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export default {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin,
};
