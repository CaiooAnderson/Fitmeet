import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Activity from '../../../components/Activity';
import {colors} from '../../../theme/colors';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

type ActivityProps = {
  id: string;
  title: string;
  date: string;
  participants: number;
  image: any;
  isPrivate: boolean;
};

type Props = {
  activities: ActivityProps[];
  onEdit: (activity: ActivityProps) => void;
  onInProgress: (activity: ActivityProps) => void;
};

const screenWidth = Dimensions.get('window').width;

export default function History({activities, onEdit, onInProgress}: Props) {
  const [showAll, setShowAll] = useState(true);

  const groupedActivities = [];
  for (let i = 0; i < activities.length; i += 2) {
    groupedActivities.push(activities.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setShowAll(prev => !prev)}
        style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SUAS ATIVIDADES</Text>
        {showAll ? (
          <ChevronUp size={30} color={colors.title} />
        ) : (
          <ChevronDown size={30} color={colors.title} />
        )}
      </TouchableOpacity>

      {activities.length === 0 ? (
        <Text style={styles.emptyText}>
          Crie atividades para serem exibidas aqui.
        </Text>
      ) : showAll ? (
        <FlatList
          data={groupedActivities}
          keyExtractor={(_, index) => `group-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={{width: screenWidth * 0.9}}>
              {item.map(activity => {
                const now = new Date();
                const scheduledDate = new Date(activity.date);
                const isInProgress = now >= scheduledDate;

                return (
                  <TouchableOpacity
                    key={activity.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      isInProgress ? onInProgress(activity) : onEdit(activity)
                    }>
                    <Activity {...activity} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 28,
    color: '#000',
  },
  emptyText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});
