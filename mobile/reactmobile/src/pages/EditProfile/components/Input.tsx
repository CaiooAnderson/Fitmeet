import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors} from '../../../theme/colors';

interface InputProps extends TextInputProps {
  label: string;
  editable?: boolean;
  value?: string;
}

export default function Input({
  label,
  editable = true,
  value = '',
  placeholder,
  secureTextEntry,
  onChangeText,
  ...rest
}: InputProps) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        editable={editable}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    width: '100%',
  },
  label: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#888',
  },
});
