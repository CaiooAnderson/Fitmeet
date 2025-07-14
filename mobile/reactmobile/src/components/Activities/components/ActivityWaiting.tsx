import {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Button from '../../Button';
import {useActivity} from '../../../context/ActivityContext';
import {useUser} from '../../../context/UserContext';

type Props = {
  activityId: string;
};

export default function ActivityWaiting({activityId}: Props) {
  const {state, subscribe, unsubscribe, fetchParticipants} = useActivity();
  const {state: userState} = useUser();
  const [status, setStatus] = useState<
    'APPROVED' | 'WAITING' | 'REJECTED' | null
  >(null);

  const userId = userState.user?.id;

  useEffect(() => {
    fetchParticipants(activityId);

    const interval = setInterval(() => {
      fetchParticipants(activityId);
    }, 1500);

    return () => clearInterval(interval);
  }, [activityId]);

  useEffect(() => {
    const participant = state.participants.find(p => p.userId === userId);
    setStatus(participant?.subscriptionStatus || null);
  }, [state.participants, userId]);

  if (status === 'REJECTED') {
    return (
      <View style={styles.center}>
        <Button
          title="Inscrição Negada"
          onPress={() => {}}
          style={[styles.button, {backgroundColor: '#E7000B'}]}
          textStyle={{color: '#fff'}}
        />
      </View>
    );
  }

  if (status === 'WAITING') {
    return (
      <View style={styles.center}>
        <Button
          title="(Aguardando)"
          onPress={() => {}}
          style={[styles.button, {opacity: 0.5}]}
          textStyle={{color: '#999'}}
        />
      </View>
    );
  }

  if (status === 'APPROVED') {
    return (
      <View style={styles.center}>
        <Button title="Sair" onPress={() => unsubscribe(activityId)} />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Button title="Participar" onPress={() => subscribe(activityId)} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    marginVertical: 20,
  },
  button: {
    width: 320,
    alignSelf: 'center',
  },
});
