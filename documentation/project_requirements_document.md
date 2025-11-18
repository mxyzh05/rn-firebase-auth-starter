# Project Requirements Document (PRD)

## 1. Project Overview
**rn-firebase-auth-starter** is a React Native starter kit built with Expo that provides a solid foundation for mobile (iOS, Android) and web apps requiring user authentication. It comes prewired with Firebase Authentication, a file-based routing structure (Expo Router), theming support (light/dark mode), and basic animations/haptic feedback—all set up to accelerate development of sign-up, login, and password-reset flows. Developers get reusable UI components, clear configuration for environment variables, and examples of integrating Firebase Realtime Database or Firestore for user profile data.

This project is being built to eliminate repetitive boilerplate when starting a new React Native app with Firebase services. Key objectives include: 1) delivering a fully functional authentication flow out of the box, 2) enforcing a modular architecture that separates UI, logic, and configuration, and 3) providing a theming system and routing pattern that can be extended for any app. Success criteria are: fast setup time (<10 minutes to get a working login/register app), zero runtime errors in the starter, and a clear path for adding new features (social login, user profiles, protected routes).

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)
- Firebase Authentication setup (email/password) with createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail
- Expo Router file-based routing for `/login`, `/register`, `/forgot-password`, and protected `/tabs` screens
- Themed UI components: `ThemedView`, `ThemedText`, plus starter templates for `ThemedTextInput` and `ThemedButton`
- React Context + custom `useAuth` hook for global auth state and session management
- Basic form validation and error handling (manual checks and friendly error messages)
- Environment variable management (`.env`) for Firebase credentials via `react-native-dotenv`
- Example integration stubs for Firebase Realtime Database or Firestore to store user profiles
- Sample animations (React Native Reanimated) and haptic feedback on form submission

### Out-of-Scope (Later Phases)
- Social login providers (Google, Apple, Facebook)
- Multi-factor authentication (SMS, email link flows)
- Full user profile pages or settings screens beyond storage stubs
- Offline data synchronization or caching strategies
- End-to-end test suites or CI/CD pipelines
- Push notifications, analytics, or other Firebase modules aside from Auth and Database/Firestore

## 3. User Flow

When a user opens the app for the first time on any platform, the routing guard checks their auth state. If unauthenticated, they are redirected to `/login`. The login screen is built with themed text inputs and buttons, and offers links to `/register` and `/forgot-password`. On submitting valid credentials, the user sees a loading animation, receives haptic feedback on success, and is navigated to the main tab-based interface.

Inside the authenticated area (`/tabs`), the user can navigate across primary application sections (e.g., Home, Profile). The app uses a React Context to maintain the user session; if the session expires or the user logs out, they are automatically redirected back to the login screen. In case of authentication errors (wrong password, network issues), user-friendly error messages appear under the form inputs.

## 4. Core Features

- **Firebase Authentication Module**: Email/password sign-up, login, password reset functions; error code mapping to UI messages
- **File-Based Routing**: Public `(auth)` route group and private `(tabs)` group using Expo Router
- **Themed UI Components**: Light/dark mode aware base components for views, text, inputs, and buttons
- **Custom Hooks & Context**: `useAuth` hook handling `login()`, `register()`, `resetPassword()`, plus global `AuthProvider`
- **Environment Management**: Secure `.env` configuration via `react-native-dotenv` plugin
- **Profile Data Stubs**: Template functions for reading/writing user data to Firebase Realtime Database or Firestore
- **Animations & Feedback**: Reanimated transitions on form submit and success haptic feedback
- **Error Handling & Validation**: Client-side form validation (email format, password strength) and catch/display of Firebase errors

## 5. Tech Stack & Tools

- **Frontend Framework**: Expo SDK 52 + React Native with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Authentication & Database**: Firebase Authentication, Firebase Realtime Database or Firestore
- **State Management**: React Context API + custom hooks
- **Styling/Theming**: Inline styles + custom themed components (`Colors.ts`)
- **Animations**: React Native Reanimated
- **Environment Variables**: `react-native-dotenv`
- **IDE/Plugins**: VS Code with ESLint, Prettier, and optional Expo CLI integration; support for run-on-save using `expo-start`

## 6. Non-Functional Requirements

- **Performance**: Login/register screens should render in under 200 ms; animations run smoothly at 60 fps
- **Security**: Firebase API keys stored in `.env`, not committed; enforce Firebase security rules for user data (users can read/write only their own records)
- **Usability**: Input fields must show inline errors; buttons disabled during loading; high color contrast for accessibility
- **Compliance**: Adhere to platform guidelines for both iOS and Android; follow WCAG AA standards for form accessibility

## 7. Constraints & Assumptions

- **Dependencies**: Requires Expo CLI, Node.js, and valid Firebase project credentials; assumes developer has basic Expo setup
- **Firebase Availability**: Internet connection mandatory; no offline-first support in v1.0
- **Platform Parity**: Some native features (haptic) may vary between iOS, Android, and Web
- **Version Lock**: The starter targets Expo SDK 52 and React Native >=0.71; future upgrades may require adjustments

## 8. Known Issues & Potential Pitfalls

- **Firebase Rate Limits**: Excessive sign-in attempts may trigger temporary blocks—implement exponential backoff or throttle attempts
- **Routing Race Conditions**: Delays in `onAuthStateChanged` listener can cause flicker between screens—use a splash/loading screen until auth state is resolved
- **Environment Variable Loading**: Mistakes in `.env` naming can lead to undefined Firebase configs—document exact `.env` keys and require a `.env.example`
- **Platform Differences**: Haptic feedback APIs differ—wrap calls in platform checks or provide fallback UI cues on web
- **Error Code Mapping**: Firebase error messages are cryptic; maintain a central map (e.g., `{ 'auth/user-not-found': 'No account found with that email.' }`) to keep messages consistent

Mitigation guidelines: include a `.env.example`, centralize error mapping, add a splash loader, and test on all target platforms early in development to catch inconsistencies.