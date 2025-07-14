import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {colors} from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'default',
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[styles.buttonText, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  default: {
    width: 320,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  defaultText: {
    color: '#FFFFFF',
  },

  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary600,
  },
  outlineText: {
    color: colors.primary600,
  },

  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ghostText: {
    color: colors.title,
  },

  buttonText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
});
