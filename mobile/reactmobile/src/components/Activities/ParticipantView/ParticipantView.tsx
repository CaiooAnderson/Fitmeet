import {useEffect, useState} from 'react';
import {Modal, View, Platform, TouchableOpacity, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from '../../../pages/Menu/ActivityCreate/activityCreateStyles';
import ActivityInfo from '../components/ActivityInfo';
import Location from '../../../pages/Menu/ActivityCreate/components/Location';
import ActivityParticipants from '../components/ActivityParticipants';
import {useActivity} from '../../../context/ActivityContext';
import {useUser} from '../../../context/UserContext';
import ActivityWaiting from '../components/ActivityWaiting';
import ActivityInProgress from '../components/ActivityInProgress';
import ActivityCheckIn from '../../Activities/components/ActivityCheckIn';
import Toast from 'react-native-toast-message';
import {ChevronLeft} from 'lucide-react-native';

type ParticipantViewProps = {
  visible: boolean;
  onClose: () => void;
  activity: any;
};

export default function ParticipantView({
  visible,
  onClose,
  activity,
}: ParticipantViewProps) {
  const insets = useSafeAreaInsets();
  const {state: activityState, fetchParticipants} = useActivity();
  const {state: userState} = useUser();
  const [hasStarted, setHasStarted] = useState(false);

  const userId = userState.user?.id;
  const userParticipant = activityState.participants.find(
    p => p.userId === userId,
  );
  const isApproved = userParticipant?.subscriptionStatus === 'APPROVED';
  const confirmedAt = userParticipant?.confirmedAt ?? null;

  useEffect(() => {
    if (visible && activity?.id) {
      fetchParticipants(activity.id);
      checkIfStarted();

      const interval = setInterval(() => {
        checkIfStarted();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [visible, activity?.id]);

  function checkIfStarted() {
    if (!activity?.scheduledDate) return;
    const now = new Date();
    const scheduledDate = new Date(activity.scheduledDate);
    setHasStarted(now >= scheduledDate);
  }

  const content = [
    {
      key: 'info',
      render: () => (
        <ActivityInfo activity={activity}>
          {activity?.address && (
            <Location
              value={activity.address}
              editable={false}
              height={288}
              titleFontFamily="BebasNeue-Regular"
              titleFontSize={20}
            />
          )}
          {hasStarted && isApproved && !userParticipant?.confirmedAt && (
            <ActivityCheckIn
              activityId={activity.id}
              isCreator={false}
              confirmedAt={confirmedAt}
            />
          )}

          {activity?.id && activity?.creator && (
            <ActivityParticipants
              activityId={activity.id}
              creator={activity.creator}
              scheduledDate={activity.scheduledDate}
            />
          )}

          {activity?.id &&
            (hasStarted ? (
              <ActivityInProgress
                activityId={activity.id}
                scheduledDate={activity.scheduledDate}
              />
            ) : (
              <ActivityWaiting activityId={activity.id} />
            ))}
        </ActivityInfo>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <FlatList
          data={content}
          renderItem={({item}) => item.render()}
          contentContainerStyle={styles.content}
        />

        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: Platform.OS === 'android' ? insets.top + 10 : insets.top,
            left: 20,
            borderColor: '#fff',
            backgroundColor: '#00000030',
            borderWidth: 1,
            borderRadius: 100,
            padding: 6,
            zIndex: 3,
          }}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Toast />
      </View>
    </Modal>
  );
}
