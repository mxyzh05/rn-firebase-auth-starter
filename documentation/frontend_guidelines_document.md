# Frontend Guideline Document for `rn-firebase-auth-starter`

## 1. Frontend Architecture

**Overview:**  
This project uses **React Native** with **Expo (SDK 52)** as the core framework, written in **TypeScript**. It integrates **Firebase Authentication** and **Realtime Database / Firestore** for backend services. Navigation is powered by **Expo Router**, and animations by **React Native Reanimated**. Environment secrets are managed with `react-native-dotenv`.

**Key Layers & Libraries:**  
- **UI Layer:** React Native core components + custom themed components (`ThemedView`, `ThemedText`, etc.)  
- **Routing:** Expo Router (file-based)  
- **State & Logic:** React’s built-in state hooks + Context API (AuthContext)  
- **Backend Services:** Firebase Auth + Realtime DB / Firestore (configured in `config/firebase.ts`)  
- **Styling:** React Native’s `StyleSheet` API & inline styles, driven by a central `Colors.ts` theme file  
- **Animations:** React Native Reanimated  
- **Env Management:** `react-native-dotenv` for Firebase keys

**Scalability & Maintainability:**  
- **Modular folders** (`app/`, `components/`, `hooks/`, `config/`, `services/`) keep code organized.  
- **File-based routing** lets you add screens by creating files.  
- **Context API** centralizes authentication state.  
- **TypeScript** ensures clear contracts between components and services.

**Performance:**  
- **Code splitting** via file-based routing.  
- **Lazy loading** of heavy screens or assets.  
- **Optimized assets** through Expo Asset tools.  
- **High-performance animations** with Reanimated.

---

## 2. Design Principles

1. **Usability**  
   - Clear forms with labeled inputs, helpful error messages, and distinct call-to-action buttons.  
   - Haptic feedback for user confirmation (e.g., on successful login).  

2. **Accessibility**  
   - Proper `accessibilityLabel` on interactive elements.  
   - Sufficient color contrast in light & dark modes.  
   - Focus management and readable font sizes.

3. **Responsiveness**  
   - Layouts adapt to various screen sizes (phone, tablet, web).  
   - Flexbox and safe-area views ensure no content is clipped or hidden.

4. **Consistency**  
   - Unified theming (color, typography, spacing) across all screens.  
   - Reusable components enforce a shared look and feel.

---

## 3. Styling and Theming

### 3.1 Styling Approach  
- **StyleSheet API + Inline Styles:** Use `StyleSheet.create` for shared styles and inline styles for one-off adjustments.  
- **Themed Components:** Wrap core components in `ThemedView` and `ThemedText` to automatically pick light/dark values from `Colors.ts`.

### 3.2 Theming Setup  
- **Colors.ts** exports light and dark palettes.  
- **ThemeContext** (provided at root) toggles between palettes based on system or user preference.

### 3.3 Visual Style  
- **Modern Flat Design:** Clean edges, minimal shadows, and clear hierarchy.  
- **Subtle Glassmorphism Elements:** Semi-transparent cards with a slight blur on authentication forms.

### 3.4 Color Palette
| Role       | Light Mode     | Dark Mode      |
|------------|----------------|----------------|
| Primary    | #0A84FF        | #64D2FF        |
| Secondary  | #5E5CE6        | #BF9FFF        |
| Background | #FFFFFF        | #000000        |
| Surface    | #F2F2F7        | #1C1C1E        |
| Text       | #1C1C1E        | #FFFFFF        |
| Error      | #FF3B30        | #FF453A        |
| Success    | #34C759        | #30D158        |
| Warning    | #FFCC00        | #FFD60A        |

### 3.5 Typography
- **Font Family:** System default (SF Pro on iOS, Roboto on Android, Segoe UI on Windows)  
- **Heading Sizes:** H1 = 28, H2 = 24, H3 = 20  
- **Body Text:** 16  
- **Buttons & Labels:** 14–16  
- **Line Height:** 1.4× font size

---

## 4. Component Structure

**Folder Layout:**  
```
app/           # Screens & router groups
components/    # Reusable UI blocks
hooks/         # Custom hooks (e.g., useAuth)
config/        # Firebase init, env setup
services/      # API/service functions (e.g., auth.ts)
assets/        # Images, icons, fonts
```  

**Reusable Component Pattern:**  
- Each component in its own folder (`components/Button/index.tsx`, `components/Button/styles.ts`).  
- Inputs like `ThemedTextInput` composed from `ThemedView` + RN `TextInput`.  
- Buttons like `ThemedButton` wrap `Pressable` + `ThemedText`.

**Benefits:**  
- **Reusability:** Build once, use everywhere.  
- **Testability:** Small units are easier to test.  
- **Maintainability:** Changes in one place reflect across the app.

---

## 5. State Management

1. **Local State:**  
   - `useState` for form values, loading, and error messages on each screen.  
2. **Global State:**  
   - **AuthContext** tracks the current user and session through `onAuthStateChanged`.  
   - Provides methods (`login`, `register`, `resetPassword`) and state (`user`, `loading`, `error`).

**Why Context API?**  
- Lightweight and built into React.  
- Perfect for auth state without adding Redux complexity.  
- Can be extended with reducers (`useReducer`) if your app’s state grows.

---

## 6. Routing and Navigation

- **Expo Router (file-based):**  
  - `app/(auth)/login.tsx`, `register.tsx`, `forgot-password.tsx` for public routes.  
  - `app/(tabs)/_layout.tsx` + tab screens under `app/(tabs)/` for authenticated routes.

- **Protected Routes:**  
  - Custom layout checks `AuthContext.user`.  
  - If no user, redirects to `/login` automatically.

- **Navigation Flows:**  
  1. Unauthenticated users land on `/login`.  
  2. They can switch to `/register` or `/forgot-password`.  
  3. On success, they’re routed to `(tabs)/home` or another protected screen.  
  4. Sign-out triggers a redirect back to `/login`.

---

## 7. Performance Optimization

- **Code Splitting & Lazy Loading:** Leverage Expo Router’s dynamic imports to load screens on demand.  
- **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` to avoid unnecessary re-renders.  
- **Asset Optimization:** Preload images with `Asset.loadAsync` and use proper image sizes.  
- **Animation Efficiency:** Reanimated’s native-driven animations minimize JS thread overhead.  
- **Bundle Size:** Remove unused libraries and keep dependencies slim.

---

## 8. Testing and Quality Assurance

1. **Unit Testing:**  
   - **Jest** + **React Native Testing Library** for components and hooks.  
   - Mock Firebase methods with `jest.mock`.

2. **Integration Testing:**  
   - Snapshot tests for UI consistency.  
   - Testing combined behavior of screens + hooks.

3. **End-to-End (E2E) Testing:**  
   - **Detox** (or **Cypress** on web) to automate flows like login → register → logout.

4. **Linting & Formatting:**  
   - **ESLint** with React Native & TypeScript rules.  
   - **Prettier** for consistent code style.

5. **Continuous Integration:**  
   - Run tests and linters on every pull request to catch issues early.

---

## 9. Conclusion and Overall Frontend Summary

This starter kit delivers a **scalable**, **maintainable**, and **performant** frontend foundation for React Native apps with Firebase authentication. It combines:

- A **modular architecture** that separates UI, logic, and services.  
- **Clear design principles** focusing on usability, accessibility, and responsiveness.  
- A **robust theming system** for light/dark modes with a modern flat style.  
- **File-based routing** via Expo Router for seamless public and protected flows.  
- **Optimized performance** through code splitting, memoization, and native-driven animations.  
- **Comprehensive testing** setup to ensure reliability.

Unique to this project are the built-in **themed UI components**, **haptic feedback examples**, and **Reanimated animations**—all ready to extend and customize. Follow these guidelines to maintain consistency, speed up feature development, and deliver a polished user experience across iOS, Android, and web.