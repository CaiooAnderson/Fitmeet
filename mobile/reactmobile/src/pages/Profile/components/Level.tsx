import {View, Text, StyleSheet, Image} from 'react-native';
import {colors} from '../../../theme/colors';
import Trophy from '../../../assets/Trophy.png';
import {Medal} from 'lucide-react-native';

type Props = {
  currentXp: number;
};

export default function Level({currentXp}: Props) {
  const xpToNextLevel = 1000;

  const level = Math.floor(currentXp / xpToNextLevel) + 1;

  const xpProgress = currentXp % xpToNextLevel;
  const progress = xpProgress / xpToNextLevel;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Medal size={30} color="#000" strokeWidth={2} />
          <Text style={styles.label}>Seu nível é</Text>
          <Text style={styles.level}>{level}</Text>
        </View>

        <View style={styles.right}>
          <Image source={Trophy} style={styles.trophy} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.progressText}>Pontos para o próximo nível</Text>
        <Text style={styles.progressText}>
          {xpProgress}/{xpToNextLevel} pts
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#69696915',
    borderRadius: 30,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 12,
    marginTop: 20,
    color: '#191919',
    fontFamily: 'DMSans-SemiBold',
  },
  level: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#191919',
    marginBottom: 20,
  },
  right: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  trophy: {
    width: 160,
    height: 80,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 6,
  },
  progressText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'DMSans-Medium',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#d3d3d3',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#000',
  },
});
