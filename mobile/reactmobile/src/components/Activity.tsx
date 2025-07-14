import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import { Calendar, Lock, Users } from 'lucide-react-native';

interface ActivityProps {
  title: string;
  date: string;
  participants: number;
  image: any;
  isPrivate?: boolean;
}

export default function Activity({
  title,
  date,
  participants,
  image,
  isPrivate = false,
}: ActivityProps) {
  function formatDateTime(dateString: string): string {
    const dateObj = new Date(dateString);
    const date = dateObj.toLocaleDateString('pt-BR');
    const time = dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${date} ${time}`;
  }
  return (
    <View style={styles.card}>
      <View style={styles.activityBlock}>
        <Image source={image} style={styles.activityImage} resizeMode="cover" />

        {isPrivate && (
          <View style={styles.lockIcon}>
            <Lock size={18} color="#fff" />
          </View>
        )}

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
          {title}
        </Text>

        <View style={styles.cardInfo}>
          <Calendar size={16} color={colors.primary600} />
          <Text style={styles.infoText}>{formatDateTime(date)}</Text>

          <Text style={styles.separator}>|</Text>

          <Users size={16} color={colors.primary600} />
          <Text style={styles.infoText}>{participants}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },
  activityBlock: {
    width: '90%',
    alignSelf: 'center',
  },
  activityImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 12,
    color: colors.title,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: colors.title,
    marginHorizontal: 4,
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: colors.title,
  },
});
