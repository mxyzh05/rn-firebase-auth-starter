flowchart TD
    A[App Launch] --> B{User Authenticated}
    B -->|No| C[Login Screen]
    B -->|Yes| D[Main App Tabs]
    C -->|Login Success| D
    C -->|Go to Register| E[Register Screen]
    C -->|Forgot Password| F[Password Reset Screen]
    E -->|Register Success| D
    E -->|Back to Login| C
    F -->|Link Sent| C
    F -->|Back to Login| C