import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {colors} from '../theme/colors';

interface CategoryProps {
  image: ImageSourcePropType;
  title?: string;
  variant?: 'default' | 'focus' | 'text';
  onPress?: () => void;
  selected?: boolean;
}

export default function Category({
  image,
  title,
  variant = 'default',
  onPress,
  selected,
}: CategoryProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Image
        source={image}
        style={[
          styles.image,
          variant === 'focus' && styles.focusImage,
          selected && styles.selectedImage,
        ]}
        resizeMode="cover"
      />
      {variant === 'text' && title && (
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    alignItems: 'center',
    marginRight: 24,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    borderWidth: 0,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  focusImage: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    marginTop: 10,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.title,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
