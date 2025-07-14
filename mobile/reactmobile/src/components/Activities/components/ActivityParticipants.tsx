import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {API_URL} from '../../../services/api';
import {storage} from '../../../storage/storage';
import {Heart, X} from 'lucide-react-native';

type Props = {
  activityId: string;
  scheduledDate: string;
  creator?: {id: string; name: string; avatar: string};
  excludeCreator?: boolean;
  fetchOnChange?: () => void;
};

type Participant = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  subscriptionStatus?: 'APPROVED' | 'WAITING' | 'REJECTED' | null;
};

export default function ActivityParticipants({
  activityId,
  scheduledDate,
  creator,
  excludeCreator = false,
  fetchOnChange,
}: Props) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const activityDate = new Date(scheduledDate);
  const isBeforeActivity = now < activityDate;

  async function fetchParticipants() {
    try {
      const token = await storage.getItem('token');
      const res = await fetch(
        `${API_URL}/activities/${activityId}/participants`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        const filtered = data.filter((p: Participant) => {
          if (p.subscriptionStatus === 'APPROVED') return true;
          if (p.subscriptionStatus === 'WAITING' && isBeforeActivity)
            return true;
          return false;
        });
        setParticipants(filtered);
      }
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(participantId: string) {
    const token = await storage.getItem('token');
    await fetch(`${API_URL}/activities/${activityId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({participantId, approved: true}),
    });
    await fetchParticipants();
    fetchOnChange?.();
  }

  async function handleReject(participantId: string) {
    const token = await storage.getItem('token');
    await fetch(`${API_URL}/activities/${activityId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({participantId, approved: false}),
    });
    await fetchParticipants();
    fetchOnChange?.();
  }

  const filteredParticipants = excludeCreator
    ? participants.filter(p => p.userId !== creator?.id)
    : participants;

  useEffect(() => {
    if (!activityId) return;

    let timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    fetchParticipants().finally(() => clearTimeout(timeout));

    const interval = setInterval(() => {
      fetchParticipants();
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [activityId]);

  const participantsList =
    excludeCreator || !creator
      ? filteredParticipants
      : [{...creator, userId: 'creator'}, ...filteredParticipants];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participantes</Text>

      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <FlatList
          data={participantsList}
          keyExtractor={item => item.id || item.userId}
          renderItem={({item}) => {
            const isOrganizer = creator?.id === item.userId;
            const showRejectIcon =
              excludeCreator &&
              !isOrganizer &&
              item.subscriptionStatus === 'APPROVED' &&
              isBeforeActivity;

            const showApproveRejectIcons =
              excludeCreator &&
              !isOrganizer &&
              item.subscriptionStatus === 'WAITING' &&
              isBeforeActivity;

            return (
              <View style={styles.participantItem}>
                <Image
                  source={{
                    uri: item.avatar?.replace('localhost', '10.0.2.2') || '',
                  }}
                  style={styles.avatar}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.name}>{item.name}</Text>
                  {isOrganizer && !excludeCreator && (
                    <Text style={styles.organizerLabel}>Organizador</Text>
                  )}
                </View>

                {(showApproveRejectIcons || showRejectIcon) && (
                  <View style={styles.iconActions}>
                    {showApproveRejectIcons && (
                      <TouchableOpacity onPress={() => handleApprove(item.id)}>
                        <Heart size={20} color="#00875F" strokeWidth={3} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleReject(item.id)}>
                      <X size={20} color="#B00020" strokeWidth={1} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={{gap: 8, paddingTop: 12}}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          style={{maxHeight: 236}}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Não há participantes nesta atividade.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 20,
    marginBottom: 12,
    color: '#000',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontFamily: 'BebasNeue-Regular',
    color: '#000',
  },
  organizerLabel: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#666',
  },
  iconActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#999',
    paddingTop: 8,
    textAlign: 'center',
  },
});
