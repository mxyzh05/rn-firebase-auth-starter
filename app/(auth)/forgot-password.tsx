import { useState } from 'react';
import { StyleSheet, Alert, TextInput } from 'react-native';
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
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      // Haptic feedback for button press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await resetPassword(data.email);

      // Success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setEmailSent(true);
    } catch (resetError) {
      // Error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorMessage = resetError instanceof Error ? resetError.message : 'Password reset failed';
      Alert.alert('Reset Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/login');
  };

  const navigateToRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/register');
  };

  if (emailSent) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title} type="title">
            Email Sent
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            We've sent password reset instructions to your email address.
          </ThemedText>

          <ThemedText style={styles.description}>
            Please check your inbox and follow the link to reset your password. If you don't see the email, check your spam folder.

            The reset link will expire after a short time for security reasons.
          </ThemedText>

          <ThemedButton
            title="Back to Login"
            onPress={navigateToLogin}
            style={styles.backButton}
          />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title} type="title">
          Reset Password
        </ThemedText>

        <ThemedText style={styles.subtitle} type="subtitle">
          Enter your email address and we'll send you instructions to reset your password.
        </ThemedText>

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
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
              style={styles.emailInput}
            />
          )}
        />

        {errors.email && (
          <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>
        )}

        <ThemedButton
          title={isSubmitting ? 'Sending...' : 'Send Reset Email'}
          onPress={handleSubmit(handleResetPassword)}
          loading={isSubmitting}
          disabled={!isValid || isLoading || isSubmitting}
          style={styles.resetButton}
        />

        <ThemedButton
          title="Cancel"
          onPress={navigateToLogin}
          variant="secondary"
          disabled={isLoading || isSubmitting}
        />

        <ThemedView style={styles.registerContainer}>
          <ThemedText style={styles.registerText}>
            Don't have an account?{' '}
          </ThemedText>
          <ThemedText
            style={styles.registerLink}
            type="link"
            onPress={navigateToRegister}
          >
            Sign Up
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
    lineHeight: 22,
    opacity: 0.7,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.8,
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
  emailInput: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 32,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});