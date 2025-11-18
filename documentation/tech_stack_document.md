# Tech Stack Document for `rn-firebase-auth-starter`

This document explains in simple terms the technologies and tools chosen for this React Native starter kit. It shows how each piece fits together to provide authentication features, theming, and smooth user experiences across iOS, Android, and web.

## 1. Frontend Technologies

We use the following to build the app’s user interface and interactions:

- **Expo SDK 52**
  - Provides a managed workflow to write a single codebase for iOS, Android, and web.
  - Offers over-the-air updates, asset management, and easy testing with Expo Go.
- **React Native**
  - Core framework for building native mobile components with JavaScript.
  - Lets us use built-in components like `View`, `Text`, `TextInput`, and `Pressable`.
- **TypeScript**
  - Adds type safety to our code, reducing runtime errors and improving maintenance.
- **Expo Router**
  - Enables file-based routing: just drop screens into folders and routes are created automatically.
  - Helps separate public routes (e.g., `/login`, `/register`) from protected areas (e.g., `/tabs`).
- **Theming & Styling**
  - Custom `ThemedView` and `ThemedText` components switch between light and dark modes effortlessly.
  - A central `Colors.ts` file defines all color values for consistent styling.
  - Inline styles where quick adjustments are needed alongside themed components.
- **State Management (UI-level)**
  - React’s `useState` for form inputs, loading indicators, and error messages.
  - React Context API to store and share authentication status across the entire app.
- **React Native Reanimated**
  - Enables high-performance, declarative animations for loading indicators and screen transitions.
- **Haptic Feedback (`expo-haptics`)**
  - Triggers subtle device vibrations to confirm actions like successful logins or button presses.
- **Environment Variables (`react-native-dotenv`)**
  - Securely injects Firebase API keys and other secrets without committing them to source control.

## 2. Backend Technologies

These technologies power user authentication and data storage:

- **Firebase Authentication**
  - Manages user signup, login, session handling, and password resets out of the box.
  - SDK functions used: `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`.
- **Firebase Realtime Database / Firestore**
  - Stores user profile data and any additional app-specific information in real time.
  - Chosen for its scalability and managed infrastructure—no need to run your own servers.
- **Firebase SDK Configuration**
  - Centralized in `config/firebase.ts` to initialize the Firebase app and export `auth` and database instances.
  - Ensures a single source of truth and easy imports throughout the app.

## 3. Infrastructure and Deployment

Our setup makes development, testing, and releases smooth and reliable:

- **Version Control: Git & GitHub**
  - Tracks every change, supports collaboration, and enables rollback if needed.
- **CI/CD: GitHub Actions**
  - Automates linting, testing, and building on every pull request or merge.
- **Build & Distribution: Expo Application Services (EAS)**
  - EAS Build compiles native binaries for iOS and Android in the cloud.
  - EAS Submit (optional) can publish builds directly to App Store and Play Store.
  - Over-the-air updates delivered via Expo, so users get the latest fixes instantly.
- **Web Hosting (optional)**
  - Firebase Hosting can serve the Expo web build, offering SSL, global CDN, and easy rollback.
- **Environment Management**
  - `.env` files store API keys and secrets.
  - `react-native-dotenv` plugin reads these securely during the build process.

## 4. Third-Party Integrations

We enhance core functionality by leveraging proven external services:

- **Firebase** (Auth, Realtime DB, Firestore)
  - Provides secure, scalable backend services with minimal setup.
- **Expo Router**
  - Simplifies navigation by turning folders into routes.
- **React Native Reanimated**
  - Offers smooth, GPU-accelerated animations without blocking the JS thread.
- **expo-haptics**
  - Adds native haptic feedback for a more tactile user experience.
- **react-native-dotenv**
  - Loads environment variables safely.

## 5. Security and Performance Considerations

We follow best practices to protect user data and optimize app speed:

- **Authentication Security**
  - All sign-in and sign-up flows use Firebase’s secure SDK methods.
  - We recommend defining Firebase Security Rules so users can only read/write their own data.
- **Environment Variables**
  - Keys and secrets never committed to Git; they live in local `.env` files.
- **Type Safety**
  - TypeScript catches errors during development, preventing many runtime issues.
- **Input Validation**
  - Use libraries like Zod or Yup to validate email formats and password rules before hitting the API.
- **Error Handling**
  - Map Firebase error codes to friendly messages (e.g., “Invalid email or password”).
- **Performance Optimizations**
  - Animations driven by Reanimated offload work to native threads.
  - Lazy loading of routes and components via Expo Router keeps initial load time low.

## 6. Conclusion and Overall Tech Stack Summary

This starter kit blends well-established tools to give you a fast, secure foundation for any React Native app that needs user authentication:

- **Expo & React Native** for cross-platform UI.
- **Firebase** for managed auth and data storage.
- **TypeScript** for code reliability.
- **Expo Router** for clear, file-based navigation.
- **Themed UI**, **Reanimated**, and **Haptics** for polished user experiences.
- **GitHub Actions** and **EAS** for smooth build and release workflows.

Together, these technologies let you focus on building unique features—while we handle the repetitive setup for authentication, theming, and deployment.