import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = null;
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (e) {
  console.error("Error reading firebase-applet-config.json in admin sdk", e);
}

export function getAdminApp() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig?.projectId;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: firebaseConfig?.storageBucket,
      });
    } else if (firebaseConfig?.projectId || projectId) {
      // Fallback to application default credentials (works in Cloud Run)
      initializeApp({
        projectId: firebaseConfig?.projectId || projectId,
        storageBucket: firebaseConfig?.storageBucket,
      });
    } else {
      initializeApp({
        projectId: 'fallback-id',
      });
    }
  }
  return getApps()[0];
}

export function getAdminDb() {
  return getFirestore(getAdminApp(), firebaseConfig?.firestoreDatabaseId);
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
