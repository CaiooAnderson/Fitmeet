import {useEffect, useState} from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import {useUser} from '../../context/UserContext';
import Level from './components/Level';
import Achievements from './components/Achievements';
import Activities from './components/Activities';
import History from './components/History';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import CreatorView from '../../components/Activities/CreatorView/CreatorView';
import {ActivityProvider} from '../../context/ActivityContext';

export default function Profile() {
  const {state} = useUser();
  const user = state.user;

  const [createdActivities, setCreatedActivities] = useState<any[]>([]);
  const [participantActivities, setParticipantActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showCreatorView, setShowCreatorView] = useState(false);

  useEffect(() => {
    async function loadActivities() {
      try {
        const token = await storage.getItem('token');
        if (!token) return;

        const [creatorRes, participantRes] = await Promise.all([
          fetch(`${API_URL}/activities/user/creator/all`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
          fetch(`${API_URL}/activities/user/participant/all`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
        ]);

        const creatorData = await creatorRes.json();
        const participantData = await participantRes.json();

        setCreatedActivities(creatorData);
        setParticipantActivities(participantData);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      }
    }

    loadActivities();
  }, []);

  if (!user) return null;

  const fixImage = (url: string) =>
    url?.replace('localhost', '10.0.2.2').replace('localstack', '10.0.2.2') ||
    '';

  const handleInProgress = (activity: any) => {
    const original = createdActivities.find(a => a.id === activity.id);
    if (original) {
      setSelectedActivity(original);
      setShowCreatorView(true);
    }
  };

  const ongoingActivities = createdActivities
    .filter((activity: any) => activity.completedAt === null)
    .map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      date: activity.scheduledDate,
      participants: activity.participantCount,
      image: {uri: fixImage(activity.image)},
      isPrivate: activity.private,
    }));

  const historyActivities = participantActivities
    .filter((activity: any) => activity.completedAt !== null)
    .map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      date: activity.scheduledDate,
      participants: activity.participantCount,
      image: {uri: fixImage(activity.image)},
      isPrivate: activity.private,
    }));

  const {width: screenWidth} = Dimensions.get('window');

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <ProfileHeader name={user.name} avatar={user.avatar} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={{paddingHorizontal: 0, marginTop: 10}}>
        <View style={{width: screenWidth, paddingHorizontal: 18}}>
          <Level currentXp={user.xp} />
        </View>
        <View style={{width: screenWidth, paddingHorizontal: 18}}>
          <Achievements />
        </View>
      </ScrollView>

      <Activities
        activities={ongoingActivities}
        onEdit={handleInProgress}
        onInProgress={handleInProgress}
      />
      <History activities={historyActivities} />

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
    </ScrollView>
  );
}
