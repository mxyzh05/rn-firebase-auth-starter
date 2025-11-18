import { TextInput, type TextInputProps, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  error?: boolean;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  error = false,
  ...otherProps
}: ThemedTextInputProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');
  const borderColor = error
    ? '#ff4444'
    : useThemeColor({ light: lightBorderColor, dark: darkBorderColor }, 'border');

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor, color: textColor, borderColor },
          style,
        ]}
        placeholderTextColor={placeholderColor + '80'}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
});