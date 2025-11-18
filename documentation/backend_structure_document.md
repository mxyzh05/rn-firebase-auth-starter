# Backend Structure Document

This document provides a clear overview of the backend setup for the `rn-firebase-auth-starter` project. It’s written in everyday language so anyone—technical or not—can understand how the backend works.

## 1. Backend Architecture

- **Serverless approach**: We rely entirely on Firebase services (Authentication, Realtime Database or Firestore) instead of running our own servers. Firebase handles the servers, scaling, and availability for us.
- **Modular design**:
  - UI (React Native screens and components) is kept separate from business logic (custom hooks and service files).
  - A `services` layer encapsulates direct calls to Firebase SDK methods.
  - A `useAuth` hook wraps those services, managing loading states and errors.
- **File-based routing**: Expo Router reads the app’s folder structure to define public (login, register) and protected (main tabs) screens automatically.
- **Scalability & performance**: Firebase auto-scales to handle any number of simultaneous users. Real-time updates and offline caching in the SDK keep the app responsive, even on slow networks.
- **Maintainability**: All Firebase configuration lives in one file (`config/firebase.ts`) and all environment variables are in a `.env` file. This keeps setup changes simple and contained.

## 2. Database Management

- **Type of database**: NoSQL
- **Firebase Realtime Database or Firestore**:
  - Both store data as JSON-style documents (Firestore uses collections and documents; Realtime Database uses a big JSON tree).
  - You can switch between the two by adjusting a few lines in the config.
- **Data access**:
  - Read/write happens through Firebase’s client SDK. You call methods like `getDoc()` or `setDoc()` (Firestore) or `onValue()` and `set()` (Realtime DB).
  - Offline persistence is supported, so data remains available when the device loses connectivity.
- **Data management practices**:
  - Keep sensitive settings (API keys) out of source control via environment variables.
  - Define Firebase security rules (in the Firebase console or `.rules` files) so users can only read and write their own data.

## 3. Database Schema

_Note: This is a NoSQL schema for Firestore. If you use Realtime Database, imagine a similar structure under `/users/{uid}`._

- **Collection: users**
  - Document ID: user’s unique ID (UID) assigned by Firebase Authentication
  - Fields:
    - `email` (string): The user’s email address
    - `createdAt` (timestamp): When the account was created
    - `displayName` (string, optional): User’s chosen display name
    - `photoURL` (string, optional): Link to user’s profile picture
    - `lastLogin` (timestamp): The last time the user signed in

- **(Optional) Collection: userProfiles**
  - You can separate profile data from auth data:
    - Document ID = UID
    - Fields like `bio`, `preferences`, `settings`, etc.

- **(Optional) Collection: posts**
  - If your app grows beyond authentication and you need to store user-generated content:
    - Document ID = auto-generated
    - Fields:
      - `authorId` (string): UID of the post’s author
      - `title` (string)
      - `body` (string)
      - `createdAt` (timestamp)

## 4. API Design and Endpoints

We don’t run our own REST server. Instead, the app talks directly to Firebase through the SDK. Think of each Firebase method as an “API endpoint.” The key operations are:

- **User authentication**:
  - `createUserWithEmailAndPassword(email, password)`: Register a new user
  - `signInWithEmailAndPassword(email, password)`: Log in
  - `sendPasswordResetEmail(email)`: Send a reset link
  - `signOut()`: Log out the current user
- **User data** (Firestore example):
  - `setDoc(doc(db, 'users', uid), { … })`: Save or update a user document
  - `getDoc(doc(db, 'users', uid))`: Fetch a user’s data
  - `updateDoc(doc(db, 'users', uid), { lastLogin: now })`: Update specific fields
- **Real-time updates** (Realtime DB example):
  - `onValue(ref(db, 'users/' + uid), callback)`: Listen for changes
  - `set(ref(db, 'users/' + uid), { … })`: Write data

These SDK calls happen inside your service files (e.g. `services/auth.ts`) and are invoked by your UI via custom hooks.

## 5. Hosting Solutions

- **Firebase Hosting (optional for web)**:
  - If you build a web version, Firebase Hosting serves your static files over a global CDN—from your React code to images and assets.
- **Firebase backend services**:
  - Authentication servers, Firestore, and Realtime Database are all managed and hosted by Google Cloud under the hood.
- **Why Firebase?**
  - **Reliability**: 99.9% uptime SLA
  - **Scalability**: Automatic, based on actual usage
  - **Cost**: Pay only for what you use (authentication and basic database operations are free up to certain limits)

## 6. Infrastructure Components

- **Authentication**: Firebase Auth handles user sign-up, login, session management, and token refresh.
- **Database**: Firestore or Realtime Database with built-in real-time syncing and offline support.
- **CDN & Caching**: Firebase Hosting (for web) delivers assets via a global CDN; the mobile SDK caches data on device.
- **Environment management**: `.env` files and `react-native-dotenv` keep keys out of code.
- **Analytics & Performance** (optional): Firebase Analytics and Performance Monitoring tie into your app for usage insights.

## 7. Security Measures

- **Authentication security**:
  - Passwords are never stored in the app; Firebase handles hashing and storage.
  - All connections use TLS/SSL.
- **Firebase Security Rules**:
  - Define who can read or write which parts of your database. For example, users can only access `/users/{theirOwnUid}`.
- **Environment variables**:
  - Firebase API keys and config values are kept in a `.env` file and never checked into Git.
- **Error handling**:
  - Service functions wrap Firebase calls in `try/catch` and translate errors into user-friendly messages.

## 8. Monitoring and Maintenance

- **Crash reporting**: Integrate Firebase Crashlytics to capture and analyze app crashes.
- **Performance monitoring**: Use the Firebase Performance SDK to track latency on auth calls and database reads/writes.
- **Logging & alerts**: Firebase Console shows error logs and usage metrics. You can set up budget alerts to avoid unexpected costs.
- **Routine updates**:
  - Keep the Firebase SDK and Expo SDK up to date.
  - Review and deploy security rule changes whenever your data model evolves.

## 9. Conclusion and Overall Backend Summary

This starter kit uses Firebase as a complete, serverless backend solution. It covers everything you need for user authentication, secure data storage, and real-time updates without managing your own servers. Key takeaways:

- **Zero server maintenance**: Firebase runs and scales everything for you.
- **Secure by default**: TLS, password hashing, and security rules protect your data.
- **Modular code structure**: Clear separation between UI components, custom hooks, and service files.
- **Extensible**: You can add more collections, Cloud Functions, or third-party integrations as your app grows.

With this setup in place, you can focus on building features and user experience rather than worrying about backend infrastructure.