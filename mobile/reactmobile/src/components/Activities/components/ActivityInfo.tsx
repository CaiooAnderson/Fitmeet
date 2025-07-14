import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../theme/colors';
import {useActivity} from '../../../context/ActivityContext';
import {useMemo} from 'react';
import { Calendar, Users } from 'lucide-react-native';

type Props = {
  activity: {
    title: string;
    description: string;
    image: string;
    scheduledDate: string;
    private: boolean;
  };
  children?: React.ReactNode;
  titleFontFamily?: string;
};

export default function ActivityInfo({activity, children}: Props) {
  const {state} = useActivity();

  const approvedCount = useMemo(() => {
    return state.participants.filter(p => p.subscriptionStatus === 'APPROVED')
      .length;
  }, [state.participants]);

  function formatDateTime(dateString: string): string {
    const dateObj = new Date(dateString);
    const date = dateObj.toLocaleDateString('pt-BR');
    const time = dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date} ${time}`;
  }

  const now = new Date();
  const scheduledDate = new Date(activity.scheduledDate);
  const isInProgress = now >= scheduledDate;

  const imageUrl =
    typeof activity.image === 'string' && activity.image.trim() !== ''
      ? activity.image
          .replace('localhost', '10.0.2.2')
          .replace('localstack', '10.0.2.2')
      : null;

  return (
    <View style={{position: 'relative'}}>
      {imageUrl ? (
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, {backgroundColor: '#eee'}]} />
      )}

      <View style={styles.overlayInfo}>
        <View style={styles.infoRow}>
          {isInProgress ? (
            <Text style={styles.infoText}>Atividade em andamento</Text>
          ) : (
            <>
              <Calendar size={20} color={colors.primary600} />
              <Text style={styles.infoText}>
                {formatDateTime(activity.scheduledDate)}
              </Text>
            </>
          )}

          <Text style={styles.separator}>|</Text>

          <Text style={styles.infoText}>
            {activity.private ? 'Privado' : 'Público'}
          </Text>

          <Text style={styles.separator}>|</Text>

          <Users size={20} color={colors.primary600} />
          <Text style={styles.infoText}>{approvedCount}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {activity.title}
        </Text>
        <Text style={styles.description} numberOfLines={6} ellipsizeMode="tail">
          {activity.description}
        </Text>
        {children && <View style={{marginTop: 40}}>{children}</View>}
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: 370,
  },
  overlayInfo: {
    position: 'absolute',
    top: 370 - 40,
    alignSelf: 'center',
    height: 60,
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.title,
    fontFamily: 'DMSans-Regular',
    marginHorizontal: 4,
  },
  separator: {
    fontSize: 14,
    color: colors.title,
    fontFamily: 'DMSans-Regular',
    marginHorizontal: 6,
  },
  details: {
    marginTop: 42,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: colors.title,
    marginBottom: 30,
  },
  description: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: colors.title,
  },
});
