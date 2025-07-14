import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useState} from 'react';
import {colors} from '../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Input({label, error, style, ...props}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = !!props.value;
  const hasAsterisk = label?.includes('*');

  const inputTextColor = error ? colors.warning : colors.text;
  const placeholderColor = error ? colors.warning : colors.placeholder;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, error && styles.errorLabel]}>
            {label?.replace('*', '').trim()}
          </Text>
          {hasAsterisk && <Text style={styles.asterisk}> *</Text>}
        </View>
      )}

      <TextInput
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={placeholderColor}
        style={[
          styles.input,
          {color: inputTextColor},
          isFocused && styles.inputFocused,
          error && styles.inputError,
          !isFocused && isFilled && styles.inputFilled,
        ]}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.title,
  },
  asterisk: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.warning,
  },
  errorLabel: {
    color: colors.warning,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#D4D4D4',
  },
  inputError: {
    borderColor: colors.warning,
  },
  inputFilled: {
    borderColor: '#E5E5E5',
  },
  errorText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: colors.warning,
    marginTop: 4,
  },
});
