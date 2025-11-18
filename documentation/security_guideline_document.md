# Security Guidelines for **rn-firebase-auth-starter**

This document defines security best practices and requirements tailored to the **rn-firebase-auth-starter**—a React Native Expo starter kit with Firebase Authentication. It aligns with security-by-design principles to help you build a robust, resilient, and maintainable mobile application.

---

## 1. Authentication & Access Control

1.1 Robust Authentication
- Use Firebase Authentication’s secure SDK methods (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`).  
- Enforce email verification flows before granting access to protected screens.  
- Do **not** allow the `none` algorithm for JWT; rely on Firebase’s token-issued mechanism.

1.2 Session & Token Management
- Leverage Firebase’s `onAuthStateChanged` listener for real-time session state.  
- Protect against session fixation by clearing previous state on logout.  
- Implement idle and absolute session timeouts using custom hooks or Cloud Functions if needed.

1.3 Multi-Factor Authentication (MFA)
- Offer MFA (SMS, authenticator apps) for sensitive accounts using Firebase Auth’s multi-factor APIs.  
- Require MFA enrollment for admin-privileged users.

1.4 Role-Based Access Control (RBAC)
- Store minimal custom claims in Firebase JWTs to differentiate roles (e.g., `admin`, `user`).  
- Validate user roles **server-side** in Cloud Functions before performing privileged operations.  
- Do **not** rely solely on client-side checks—every protected action must re-verify the token.

---

## 2. Input Handling & Processing

2.1 Client-Side & Server-Side Validation
- Use a schema validation library (e.g., Zod or Yup) to enforce email format and password complexity on the client.  
- Mirror validation rules in Cloud Functions or backend services to avoid bypassing via manipulated clients.

2.2 Injection Prevention
- Firebase SDK abstracts away direct database queries—avoid constructing dynamic keys or paths with untrusted input.  
- Sanitize any user-supplied strings before writing to Firestore or Realtime Database to prevent malicious content.

2.3 File Upload Safety
- If you add file upload features, validate file types/extensions and scan for malware before uploading to Cloud Storage.  
- Store uploads outside the public root and generate time-limited download URLs.

---

## 3. Data Protection & Privacy

3.1 Encryption & Transport Security
- Ensure **all** network requests use HTTPS/TLS 1.2+ (Expo’s default).  
- Do not downgrade to HTTP—enforce secure endpoints in your API integrations.

3.2 Secret Management
- Store Firebase API keys and config in `.env` files excluded from source control (`.gitignore`).  
- Use Expo’s `expo-constants` or a secure vault (e.g., AWS Secrets Manager) for production secrets if feasible.

3.3 Data at Rest
- If persisting tokens or PII locally, use `expo-secure-store` instead of `AsyncStorage`.  
- Encrypt any additional local caches or databases (e.g., SQLite) with a device-specific key.

3.4 Privacy Compliance
- Collect only the PII you absolutely need (email, display name).  
- Add a privacy policy and request user consent for data processing as required by GDPR/CCPA.

---

## 4. API & Service Security

4.1 Firestore & Realtime Database Rules
- Define **granular** security rules that allow users to read/write **only** their own documents (eg. `request.auth.uid == resource.data.ownerId`).  
- Test your rules with the Firebase emulator suite before deployment.

4.2 Rate Limiting & Abuse Protection
- Integrate Cloud Functions or a third-party service to throttle password-reset and login attempts.  
- Implement CAPTCHA challenges for repeated failures.

4.3 CORS & API Versioning
- If exposing custom HTTP Cloud Functions, configure CORS to allow only your mobile app’s origins.  
- Use versioned endpoints (`/v1/…`) to manage breaking changes predictably.

---

## 5. Mobile Application Security Hygiene

5.1 Secure Storage & Key Management
- Avoid bundling service account or administrative credentials in the app.  
- Rely on Firebase’s client SDK; move privileged operations to Cloud Functions.

5.2 Code Obfuscation & Runtime Protection
- Enable the Hermes engine and JavaScript minification in production builds.  
- Consider using an Obfuscator plugin to protect sensitive code paths.

5.3 Certificate Pinning & Transport Integrity
- For any third-party REST calls, enforce certificate pinning (e.g., `react-native-ssl-pinning`).

5.4 Debug & Logging Controls
- Disable remote debugging, console logs, and developer menus in **production** builds.  
- Redact sensitive data (tokens, user emails) from crash reports and analytics.

---

## 6. Infrastructure & CI/CD Security

6.1 Dependency & Vulnerability Management
- Use a lockfile (`yarn.lock` or `package-lock.json`) and run regular `npm audit` or Snyk scans.  
- Upgrade expo, React Native, and Firebase libraries promptly when security patches are released.

6.2 Secure Build Pipelines
- Store CI/CD secrets (Expo tokens, Firebase service account keys) in the pipeline’s secret store—not in repo.  
- Perform static analysis (ESLint + security plugins) and type checks (TypeScript) on every pull request.

6.3 Environment Segregation
- Maintain separate Firebase projects for development, staging, and production.  
- Apply stricter security rules in production and limit access to production credentials.

---

## 7. Dependency Management & Third-Party Audits

- Vet all npm/Expo packages for maintenance activity and known vulnerabilities before adoption.  
- Remove unused libraries to reduce the attack surface.  
- Automate dependency scanning with tools like Dependabot or Renovate.

---

## 8. Ongoing Security Practices

- Conduct periodic penetration tests or hire a third-party auditor.  
- Monitor Firebase usage logs and set up alerts for anomalous activity (unusual sign-in locations, mass account creation).  
- Document and rehearse incident response plans (token revocation, password reset mandates).


By integrating these guidelines from design through deployment, **rn-firebase-auth-starter** will adhere to security-by-design, ensuring a robust foundation for any React Native Expo app relying on Firebase Authentication.
