import {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {styles} from './ActivitiesByTypesStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../routes/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import Category from '../../components/Category';
import Activity from '../../components/Activity';
import {colors} from '../../theme/colors';
import CreatorView from '../../components/Activities/CreatorView/CreatorView';
import ParticipantView from '../../components/Activities/ParticipantView/ParticipantView';
import {ActivityProvider} from '../../context/ActivityContext';
import {ChevronDown, ChevronLeft, ChevronUp} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const ActivitiesByTypes = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, 'ActivitiesByTypes'>
    >();
  const route = useRoute<RouteProp<RootStackParamList, 'ActivitiesByTypes'>>();
  const {typeId} = route.params;

  const [userId, setUserId] = useState('');
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [currentType, setCurrentType] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllYourActivities, setShowAllYourActivities] = useState(true);
  const [showAllCommunityActivities, setShowAllCommunityActivities] =
    useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [showCreatorView, setShowCreatorView] = useState(false);
  const [showParticipantView, setShowParticipantView] = useState(false);

  useEffect(() => {
    fetchData();
  }, [typeId]);

  async function fetchData() {
    try {
      const token = await storage.getItem('token');
      if (!token) return;

      const [typesRes, activitiesRes, userRes] = await Promise.all([
        fetch(`${API_URL}/activities/types`, {
          headers: {Authorization: `Bearer ${token}`},
        }),
        fetch(`${API_URL}/activities/all`, {
          headers: {Authorization: `Bearer ${token}`},
        }),
        fetch(`${API_URL}/user`, {
          headers: {Authorization: `Bearer ${token}`},
        }),
      ]);

      const typesData = await typesRes.json();
      const activitiesData = await activitiesRes.json();
      const userData = await userRes.json();

      setActivityTypes(typesData);
      setCurrentType(typesData.find((type: any) => type.id === typeId) || null);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setUserId(userData.id || '');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredActivities = activities.filter(
    activity =>
      activity.type === currentType?.name && activity.completedAt === null,
  );

  const yourActivities = filteredActivities.filter(
    activity => activity.creator?.id === userId,
  );

  const communityActivities = filteredActivities;

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    if (activity.creator?.id === userId) {
      setShowCreatorView(true);
    } else {
      setShowParticipantView(true);
    }
  };

  const groupInPairs = (list: any[]) => {
    const grouped = [];
    for (let i = 0; i < list.length; i += 2) {
      grouped.push(list.slice(i, i + 2));
    }
    return grouped;
  };

  const groupedYourActivities = groupInPairs(yourActivities);
  const groupedCommunityActivities = groupInPairs(communityActivities);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{marginTop: 40}}
        />
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom: 40}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color={colors.title} strokeWidth={3} />
            </TouchableOpacity>
            <Text style={styles.title}>{currentType?.name}</Text>
            <View style={{width: 28}} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATEGORIAS</Text>
            <View style={{marginVertical: 20}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {activityTypes.map(type => {
                  const fixedImageUrl = type.image
                    ?.replace('localhost', '10.0.2.2')
                    .replace('localstack', '10.0.2.2');
                  return (
                    <Category
                      key={type.id}
                      image={{uri: fixedImageUrl || ''}}
                      title={type.name}
                      variant="text"
                      onPress={() =>
                        navigation.navigate('ActivitiesByTypes', {
                          typeId: type.id,
                        })
                      }
                      selected={type.id === typeId}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowAllYourActivities(prev => !prev)}
              style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SUAS ATIVIDADES</Text>
              {showAllYourActivities ? (
                <ChevronUp size={30} color={colors.title} />
              ) : (
                <ChevronDown size={30} color={colors.title} />
              )}
            </TouchableOpacity>

            {yourActivities.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma atividade encontrada.
              </Text>
            ) : showAllYourActivities ? (
              <FlatList
                data={groupedYourActivities}
                keyExtractor={(_, index) => `your-group-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View style={{width: screenWidth * 0.9}}>
                    {item.map(activity => (
                      <TouchableOpacity
                        key={activity.id}
                        activeOpacity={0.8}
                        onPress={() => handleActivityClick(activity)}>
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
            ) : null}
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowAllCommunityActivities(prev => !prev)}
              style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ATIVIDADES DA COMUNIDADE</Text>
              {/* {showAllCommunityActivities ? (
                <CaretUp size={30} color={colors.title} />
              ) : (
                <CaretDown size={30} color={colors.title} />
              )} */}
            </TouchableOpacity>

            {communityActivities.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma atividade encontrada.
              </Text>
            ) : showAllCommunityActivities ? (
              <FlatList
                data={groupedCommunityActivities}
                keyExtractor={(_, index) => `community-group-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View style={{width: screenWidth * 0.9}}>
                    {item.map(activity => (
                      <TouchableOpacity
                        key={activity.id}
                        activeOpacity={0.8}
                        onPress={() => handleActivityClick(activity)}>
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
            ) : null}
          </View>

          {selectedActivity && (
            <>
              <ActivityProvider>
                <CreatorView
                  visible={showCreatorView}
                  activity={selectedActivity}
                  onClose={() => {
                    setShowCreatorView(false);
                    setSelectedActivity(null);
                  }}
                />
              </ActivityProvider>
              <ActivityProvider>
                <ParticipantView
                  visible={showParticipantView}
                  activity={selectedActivity}
                  onClose={() => {
                    setShowParticipantView(false);
                    setSelectedActivity(null);
                  }}
                />
              </ActivityProvider>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ActivitiesByTypes;
