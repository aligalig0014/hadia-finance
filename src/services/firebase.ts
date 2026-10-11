/**
 * ALI KING GAME - Firebase Services & Firestore Architecture
 * 
 * Provides configuration and hooks for connecting Google Firebase Firestore
 * and Firebase Authentication if environment variables are provided.
 * 
 * Firestore Collection Schema:
 * - users/{uid}: User profile, coins balance, streak, bestScore
 * - games/{gameId}: Game metadata, rules, popularity
 * - gameSessions/{sessionId}: Historical round records with score & virtual coins won
 * - rewards/{rewardId}: Daily check-in streak definitions
 * - achievements/{achievementId}: Global achievements & requirements
 * - leaderboard/{leaderboardId}: Cached rankings snapshots
 * - notifications/{notifId}: System & player notifications
 * - settings/global: Admin settings (announcement banner, multiplier, maintenance)
 */

export interface FirestoreCollections {
  users: 'users';
  games: 'games';
  gameSessions: 'gameSessions';
  rewards: 'rewards';
  achievements: 'achievements';
  leaderboard: 'leaderboard';
  notifications: 'notifications';
  settings: 'settings';
}

export const FIRESTORE_COLLECTIONS: FirestoreCollections = {
  users: 'users',
  games: 'games',
  gameSessions: 'gameSessions',
  rewards: 'rewards',
  achievements: 'achievements',
  leaderboard: 'leaderboard',
  notifications: 'notifications',
  settings: 'settings'
};

// Check if Firebase environment variables are defined
export const isFirebaseConfigured = (): boolean => {
  return typeof import.meta !== 'undefined' &&
    Boolean(import.meta.env?.VITE_FIREBASE_API_KEY && import.meta.env?.VITE_FIREBASE_PROJECT_ID);
};

export const getFirebaseConfig = () => {
  return {
    apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env?.VITE_FIREBASE_APP_ID || ''
  };
};

/**
 * Recommended Firestore Security Rules:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Users can read public profiles and write only their own profile
 *     match /users/{userId} {
 *       allow read: if true;
 *       allow write: if request.auth != null && request.auth.uid == userId;
 *     }
 *     
 *     // Game sessions can be read by all and created by the authenticated player
 *     match /gameSessions/{sessionId} {
 *       allow read: if true;
 *       allow create: if request.auth != null;
 *     }
 *     
 *     // Public game rules, achievements, rewards, leaderboard
 *     match /games/{gameId} { allow read: if true; }
 *     match /achievements/{id} { allow read: if true; }
 *     match /rewards/{id} { allow read: if true; }
 *     match /leaderboard/{id} { allow read: if true; }
 *     
 *     // Global settings only editable by admin
 *     match /settings/{doc} {
 *       allow read: if true;
 *       allow write: if request.auth != null && request.auth.token.admin == true;
 *     }
 *   }
 * }
 */
