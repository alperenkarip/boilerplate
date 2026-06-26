// Firebase web SDK bootstrap (ADR-020 / ADR-021).
//
// Initializes the single app instance plus the Auth, Firestore, and Functions
// handles consumed by the port adapters. In development the SDKs are wired to
// the local emulator suite (firebase.json: auth 9099, firestore 8080,
// functions 5001). Firestore uses a persistent local cache for offline reads.
//
// NOTE: This module performs SDK initialization as an import side effect. It is
// imported transitively by the adapters; unit tests mock the adapters, so this
// file (and the live SDK) never runs under vitest.

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);

// Firestore with an offline-capable persistent cache (multi-tab safe).
export const db: Firestore = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const functions: Functions = getFunctions(
  firebaseApp,
  import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION,
);

// Emulator suite is on by default in DEV, and can be forced on/off via
// VITE_FIREBASE_USE_EMULATOR ('true' / 'false').
const emulatorFlag = import.meta.env.VITE_FIREBASE_USE_EMULATOR;
const useEmulator = emulatorFlag === 'true' || (import.meta.env.DEV && emulatorFlag !== 'false');

if (useEmulator) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
