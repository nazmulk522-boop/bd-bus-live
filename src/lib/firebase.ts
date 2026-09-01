import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson?.apiKey || '',
  authDomain: firebaseConfigJson?.authDomain || '',
  projectId: firebaseConfigJson?.projectId || '',
  storageBucket: firebaseConfigJson?.storageBucket || '',
  messagingSenderId: firebaseConfigJson?.messagingSenderId || '',
  appId: firebaseConfigJson?.appId || ''
};

// Initialize Firebase App safely
let appInstance: FirebaseApp;
try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase app init fallback:', e);
  appInstance = initializeApp(firebaseConfig, 'fallback-app');
}

export const app = appInstance;

// Initialize Firestore with specific database ID if configured
let dbInstance: Firestore;
try {
  dbInstance = firebaseConfigJson?.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
    : getFirestore(app);
} catch (e) {
  console.warn('Firestore instance init fallback:', e);
  dbInstance = getFirestore(app);
}

export const db: Firestore = dbInstance;
