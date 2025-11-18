import { Pressable, type PressableProps, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  title: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightTextColor,
  darkTextColor,
  variant = 'primary',
  loading = false,
  title,
  disabled,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'primary' ? 'tint' : 'background'
  );

  const textColor = useThemeColor(
    { light: lightTextColor, dark: darkTextColor },
    variant === 'primary' ? 'background' : 'text'
  );

  const borderColor = useThemeColor({}, 'border');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: pressed || disabled ? 0.7 : 1,
        },
        variant === 'secondary' && styles.secondaryButton,
        style,
      ]}
      disabled={disabled || loading}
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
});