import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '../../../components/Button';
import Activity from '../../../components/Activity';
import CreatorView from '../../../components/Activities/CreatorView/CreatorView';
import ParticipantView from '../../../components/Activities/ParticipantView/ParticipantView';
import {styles} from '../menuStyles';
import {colors} from '../../../theme/colors';
import {API_URL} from '../../../services/api';
import {storage} from '../../../storage/storage';
import {RootStackParamList} from '../../../routes/types';
import {useUser} from '../../../context/UserContext';
import {ActivityProvider} from '../../../context/ActivityContext';

type NavigationProps = StackNavigationProp<RootStackParamList>;

const screenWidth = Dimensions.get('window').width;

export default function Recommended() {
  const navigation = useNavigation<NavigationProps>();
  const {state} = useUser();
  const user = state.user;

  const preferences = user?.preferences ?? [];

  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [creatorModalVisible, setCreatorModalVisible] = useState(false);
  const [participantModalVisible, setParticipantModalVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await storage.getItem('token');
        if (!token) return;

        const typesRes = await fetch(`${API_URL}/activities/types`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const typesData = await typesRes.json();

        const typeMap = typesData.reduce(
          (acc: Record<string, string>, item: any) => {
            acc[item.id] = item.name;
            return acc;
          },
          {},
        );
        setAllTypes(Object.keys(typeMap));

        const activitiesRes = await fetch(`${API_URL}/activities/all`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const activitiesData = await activitiesRes.json();

        const preferredTypeNames = preferences.map(id => typeMap[id]);

        const filtered = activitiesData.filter((activity: any) => {
          const isNotCreator = activity.creator?.id !== user?.id;
          const isActive = !activity.completedAt;

          if (preferences.length === 0) {
            return isNotCreator && isActive;
          }

          const isPreferredType = preferredTypeNames.includes(activity.type);
          return isNotCreator && isActive && isPreferredType;
        });

        setActivities(filtered);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id, JSON.stringify(user?.preferences)]);

  const handleSeeMore = () => {
    let selectedTypeId: string | null = null;

    if (preferences.length === 1) {
      selectedTypeId = preferences[0];
    } else if (preferences.length > 1) {
      const index = Math.floor(Math.random() * preferences.length);
      selectedTypeId = preferences[index];
    } else if (allTypes.length > 0) {
      const index = Math.floor(Math.random() * allTypes.length);
      selectedTypeId = allTypes[index];
    }

    if (selectedTypeId) {
      navigation.navigate('ActivitiesByTypes', {typeId: selectedTypeId});
    }
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    if (activity.creator?.id === user?.id) {
      setCreatorModalVisible(true);
    } else {
      setParticipantModalVisible(true);
    }
  };

  const groupedActivities = [];
  for (let i = 0; i < activities.length; i += 2) {
    groupedActivities.push(activities.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SUAS RECOMENDAÇÕES</Text>
        <TouchableOpacity>
          <Button
            title="VER MAIS"
            variant="ghost"
            onPress={handleSeeMore}
            style={{width: 70, height: 30}}
            textStyle={{
              fontFamily: 'BebasNeue-Regular',
              fontSize: 14,
              color: colors.title,
            }}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : groupedActivities.length === 0 ? (
        <Text style={{marginLeft: 24, fontFamily: 'DMSans-Regular'}}>
          Nenhuma atividade encontrada.
        </Text>
      ) : (
        <FlatList
          data={groupedActivities}
          keyExtractor={(_, index) => `group-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={{width: screenWidth * 0.9}}>
              {item.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  onPress={() => handleActivityClick(activity)}
                  style={{marginBottom: 16}}>
                  <Activity
                    title={activity.title}
                    date={activity.scheduledDate}
                    participants={activity.participantCount}
                    image={{
                      uri:
                        activity.image
                          ?.replace('localhost', '10.0.2.2')
                          .replace('localstack', '10.0.2.2') || '',
                    }}
                    isPrivate={activity.private}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
      <ActivityProvider>
        <CreatorView
          visible={creatorModalVisible}
          onClose={() => setCreatorModalVisible(false)}
          activity={selectedActivity}
        />
      </ActivityProvider>
      <ActivityProvider>
        <ParticipantView
          visible={participantModalVisible}
          onClose={() => setParticipantModalVisible(false)}
          activity={selectedActivity}
        />
      </ActivityProvider>
    </View>
  );
}
