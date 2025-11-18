import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import * as Haptics from 'expo-haptics';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/ThemedButton';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      // Haptic feedback for button press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { confirmPassword, ...registerData } = data;
      await register(registerData);

      // Success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigation to main app will be handled by the root layout
    } catch (registerError) {
      // Error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorMessage = registerError instanceof Error ? registerError.message : 'Registration failed';
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/login');
  };

  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: '', color: 'transparent' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: 'Weak', color: '#ff4444' };
    if (strength <= 3) return { strength, text: 'Fair', color: '#ffaa00' };
    if (strength <= 4) return { strength, text: 'Good', color: '#00aaff' };
    return { strength, text: 'Strong', color: '#00ff00' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title} type="title">
          Create Account
        </ThemedText>

        <ThemedText style={styles.subtitle} type="subtitle">
          Sign up to get started
        </ThemedText>

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              placeholder="Full Name (optional)"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.displayName}
              editable={!isLoading && !isSubmitting}
            />
          )}
        />

        {errors.displayName && (
          <ThemedText style={styles.errorText}>{errors.displayName.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              editable={!isLoading && !isSubmitting}
            />
          )}
        />

        {errors.email && (
          <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              placeholder="Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.password}
              editable={!isLoading && !isSubmitting}
            />
          )}
        />

        {password && (
          <ThemedView style={styles.passwordStrengthContainer}>
            <ThemedView style={styles.passwordStrengthBar}>
              <ThemedView
                style={[
                  styles.passwordStrengthFill,
                  {
                    width: `${(passwordStrength.strength / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  },
                ]}
              />
            </ThemedView>
            <ThemedText style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
              Password strength: {passwordStrength.text}
            </ThemedText>
          </ThemedView>
        )}

        {errors.password && (
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              placeholder="Confirm Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.confirmPassword}
              editable={!isLoading && !isSubmitting}
            />
          )}
        />

        {errors.confirmPassword && (
          <ThemedText style={styles.errorText}>{errors.confirmPassword.message}</ThemedText>
        )}

        <ThemedButton
          title={isSubmitting ? 'Creating Account...' : 'Create Account'}
          onPress={handleSubmit(handleRegister)}
          loading={isSubmitting}
          disabled={!isValid || isLoading || isSubmitting}
          style={styles.registerButton}
        />

        <ThemedView style={styles.loginContainer}>
          <ThemedText style={styles.loginText}>
            Already have an account?{' '}
          </ThemedText>
          <ThemedText
            style={styles.loginLink}
            type="link"
            onPress={navigateToLogin}
          >
            Sign In
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: '#ff444420',
    borderColor: '#ff4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 8,
  },
  passwordStrengthContainer: {
    marginVertical: 4,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});