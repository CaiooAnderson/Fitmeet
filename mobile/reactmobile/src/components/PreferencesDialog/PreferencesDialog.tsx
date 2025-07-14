import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {styles} from './preferencesDialogStyles';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import Button from '../Button';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../../context/UserContext';
import {Check, ChevronLeft} from 'lucide-react-native';
import FrameImage from '../../assets/Frame.png';

type ActivityType = {
  id: string;
  name: string;
  image?: string;
};

type PreferencesDialogProps = {
  visible: boolean;
  onConfirm: () => void;
  onSkip?: () => void;
  mode?: 'menu' | 'edit';
  initialSelected?: string[];
  onSaveLocal?: (selected: string[]) => void;
};

export default function PreferencesDialog({
  visible,
  mode = 'menu',
  onConfirm,
  onSkip,
  onSaveLocal,
  initialSelected,
}: PreferencesDialogProps) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const {refreshUser} = useUser();

  useEffect(() => {
    if (visible) {
      fetchActivities();
      if (mode === 'edit' && initialSelected) {
        setSelected(initialSelected);
      }
    }
  }, [visible]);

  async function fetchActivities() {
    try {
      setLoading(true);
      const token = await storage.getItem('token');
      if (!token) {
        Toast.show({type: 'error', text1: 'Usuário não autenticado.'});
        return;
      }

      const response = await fetch(`${API_URL}/activities/types`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const data = await response.json();
      if (response.ok) {
        setActivityTypes(data);
      } else {
        Toast.show({
          type: 'error',
          text1: data.error || 'Erro ao carregar atividades.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({type: 'error', text1: 'Erro ao conectar com o servidor.'});
    } finally {
      setLoading(false);
    }
  }

  function toggleActivity(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (mode === 'edit') {
      onSaveLocal?.(selected);
      onConfirm();
      return;
    }

    try {
      const token = await storage.getItem('token');
      if (!token) {
        Toast.show({type: 'error', text1: 'Usuário não autenticado.'});
        return;
      }

      const response = await fetch(`${API_URL}/user/preferences/define`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selected),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify({preferenciasSalvas: true}),
        );

        await refreshUser();

        Toast.show({
          type: 'success',
          text1: 'Preferências salvas com sucesso!',
        });

        onConfirm();
      } else {
        Toast.show({
          type: 'error',
          text1: data.error || 'Erro ao salvar preferências.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({type: 'error', text1: 'Erro ao conectar com o servidor.'});
    }
  }

  async function handleSkip() {
    try {
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({preferenciasSalvas: false}),
      );
      onSkip?.();
    } catch (error) {
      console.error(error);
    }
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade">
      <View style={styles.modalOverlay}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.iconCircle}>
              <Image
                source={FrameImage}
                style={{width: 48, height: 48}}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            {mode === 'edit' && (
              <TouchableOpacity
                style={{alignSelf: 'flex-start', marginBottom: 16}}
                onPress={onConfirm}>
                <ChevronLeft size={28} color="#000" />
              </TouchableOpacity>
            )}

            <Text style={styles.title}>SELECIONE SEU TIPO FAVORITO</Text>

            <ScrollView contentContainerStyle={styles.activitiesContainer}>
              <View style={styles.contentBlock}>
                <View style={styles.activitiesGrid}>
                  {activityTypes.map(activity => {
                    const isSelected = selected.includes(activity.id);
                    return (
                      <TouchableOpacity
                        key={activity.id}
                        onPress={() => toggleActivity(activity.id)}
                        style={styles.activityItem}
                        activeOpacity={0.8}>
                        <View style={{position: 'relative'}}>
                          <Image
                            source={{
                              uri:
                                activity.image
                                  ?.replace('localhost', '10.0.2.2')
                                  .replace('localstack', '10.0.2.2') || '',
                            }}
                            style={[
                              styles.activityImage,
                              isSelected && styles.selectedImage,
                            ]}
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkIcon}>
                              <Check size={24} color="#fff" strokeWidth={3} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.activityName}>{activity.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.buttonsBlock}>
                  <Button
                    title="Salvar"
                    onPress={handleSave}
                    style={styles.button}
                  />

                  {mode === 'menu' && (
                    <Button
                      title="Pular"
                      onPress={handleSkip}
                      variant="ghost"
                      style={[styles.button, {marginTop: 8}]}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}
