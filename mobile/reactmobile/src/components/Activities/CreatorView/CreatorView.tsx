import {useEffect, useState} from 'react';
import {Modal, View, Platform, TouchableOpacity, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ActivityInfo from '../components/ActivityInfo';
import Location from '../../../pages/Menu/ActivityCreate/components/Location';
import ActivityParticipants from '../components/ActivityParticipants';
import {useActivity} from '../../../context/ActivityContext';
import ActivityInProgress from '../components/ActivityInProgress';
import Button from '../../../components/Button';
import {API_URL} from '../../../services/api';
import {storage} from '../../../storage/storage';
import ActivityEdit from '../ActivityEdit/ActivityEdit';
import ActivityCheckIn from '../components/ActivityCheckIn';
import {ChevronLeft} from 'lucide-react-native';

type CreatorViewProps = {
  visible: boolean;
  onClose: () => void;
  activity: any;
};

export default function CreatorView({
  visible,
  onClose,
  activity,
}: CreatorViewProps) {
  const insets = useSafeAreaInsets();
  const {fetchParticipants, fetchConfirmationCode, state} = useActivity();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    if (!visible || !activity?.id) return;

    fetchParticipants(activity.id);
    fetchConfirmationCode(activity.id);
    checkIfStarted();

    const interval = setInterval(checkIfStarted, 3000);
    return () => clearInterval(interval);
  }, [visible, activity?.id]);

  function checkIfStarted() {
    if (!activity?.scheduledDate) return;
    const now = new Date();
    const scheduledDate = new Date(activity.scheduledDate);
    setIsInProgress(now >= scheduledDate);
  }

  const handleConclude = async () => {
    try {
      const token = await storage.getItem('token');
      await fetch(`${API_URL}/activities/${activity.id}/conclude`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
    } catch (err) {
      console.error('Não foi possível finalizar a atividade.');
      console.error('Erro ao finalizar atividade:', err);
    }
  };

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

          {isInProgress && (
            <ActivityCheckIn
              activityId={activity.id}
              confirmationCode={state.confirmationCode ?? ''}
              isCreator={true}
            />
          )}

          {activity?.id && activity?.creator && (
            <ActivityParticipants
              activityId={activity.id}
              creator={activity.creator}
              scheduledDate={activity.scheduledDate}
              excludeCreator={true}
              fetchOnChange={() => fetchParticipants(activity.id)}
            />
          )}

          {!isInProgress && (
            <Button
              title="Editar Atividade"
              onPress={() => setShowEditModal(true)}
              style={{marginTop: 24}}
            />
          )}

          {isInProgress && (
            <ActivityInProgress
              activityId={activity.id}
              scheduledDate={activity.scheduledDate}
            />
          )}

          {isInProgress && (
            <Button
              title="Finalizar Atividade"
              onPress={handleConclude}
              style={{marginTop: 24}}
            />
          )}
        </ActivityInfo>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <FlatList
            data={content}
            renderItem={({item}) => item.render()}
            contentContainerStyle={{paddingBottom: 20}}
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
        </View>
      </Modal>

      {activity && (
        <ActivityEdit
          visible={showEditModal}
          activity={activity}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
