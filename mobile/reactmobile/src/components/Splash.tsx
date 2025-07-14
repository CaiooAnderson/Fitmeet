import {View, StyleSheet, Image} from 'react-native';
import {colors} from '../theme/colors';
import FrameImage from '../assets/Frame.png';

type SplashProps = {
  onFinish: () => void;
};

export default function Splash({onFinish}: SplashProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Image source={FrameImage} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffcc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 48,
    height: 48,
  },
});
