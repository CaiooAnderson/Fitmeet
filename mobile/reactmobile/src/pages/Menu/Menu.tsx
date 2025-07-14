import {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {styles} from './menuStyles';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PreferencesDialog from '../../components/PreferencesDialog/PreferencesDialog';
import MenuHeader from './components/MenuHeader';
import Recommended from './components/Recommended';
import Category from '../../components/Category';
import {colors} from '../../theme/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../routes/types';
import {useUser} from '../../context/UserContext';
import ActivityCreate from './ActivityCreate/ActivityCreate';
import Toast from 'react-native-toast-message';
import {Plus} from 'lucide-react-native';

type ActivityType = {
  id: string;
  name: string;
  image?: string;
};

type NavigationProps = StackNavigationProp<RootStackParamList>;

export default function Menu() {
  const {refreshUser, state} = useUser();
  const user = state.user;
  const [showPreferences, setShowPreferences] = useState<boolean | null>(null);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const [loadingUser, setLoadingUser] = useState(true);

  const handleConfirm = async () => {
    try {
      const token = await storage.getItem('token');
      if (!token) return;

      await refreshUser();

      const updatedUser = state.user;
      if (updatedUser?.id) {
        await AsyncStorage.mergeItem(
          `userData:${updatedUser.id}`,
          JSON.stringify({preferenciasSalvas: true}),
        );
      }

      setShowPreferences(false);
    } catch (err) {
      console.error('Erro ao salvar preferências:', err);
    }
  };

  const handleSkip = async () => {
    try {
      const token = await storage.getItem('token');
      if (!token) return;

      await refreshUser();

      const updatedUser = state.user;
      if (updatedUser?.id) {
        await AsyncStorage.mergeItem(
          `userData:${updatedUser.id}`,
          JSON.stringify({preferenciasSalvas: false}),
        );
      }

      setShowPreferences(false);
    } catch (err) {
      console.error('Erro ao pular preferências:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      refreshUser().finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    async function checkPreferences() {
      try {
        const token = await storage.getItem('token');
        if (!token) return;

        const userRes = await fetch(`${API_URL}/user`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const user = await userRes.json();

        const userDataString = await AsyncStorage.getItem(
          `userData:${user.id}`,
        );
        const userData = userDataString ? JSON.parse(userDataString) : null;

        if (userData?.preferenciasSalvas) {
          setShowPreferences(false);
        } else {
          setShowPreferences(true);
        }
      } catch (error) {
        console.error('Erro ao checar preferências do usuário:', error);
        setShowPreferences(false);
      }
    }

    checkPreferences();
  }, []);

  useEffect(() => {
    if (showPreferences === false) {
      fetchActivityTypes();
    }
  }, [showPreferences]);

  function handleActivityCreated() {
    Toast.show({
      type: 'success',
      text1: 'Atividade criada com sucesso!',
    });
  }

  async function fetchActivityTypes() {
    try {
      const token = await storage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/activities/types`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (response.ok) {
        const data = await response.json();
        setActivityTypes(data);
      } else {
        console.error('Erro ao carregar categorias');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser || showPreferences === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{marginTop: 12}}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <PreferencesDialog
        visible={showPreferences}
        mode="menu"
        onConfirm={handleConfirm}
        onSkip={handleSkip}
      />

      {!showPreferences && (
        <>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.container}>
            <MenuHeader />
            <Recommended />

            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>CATEGORIAS</Text>

              <View style={{marginVertical: 20}}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    {activityTypes.map(item => {
                      const fixedImageUrl = item.image
                        ?.replace('localhost', '10.0.2.2')
                        .replace('localstack', '10.0.2.2');

                      return (
                        <Category
                          key={item.id}
                          image={{uri: fixedImageUrl || ''}}
                          title={item.name}
                          variant="text"
                          onPress={() =>
                            navigation.navigate('ActivitiesByTypes', {
                              typeId: item.id,
                            })
                          }
                        />
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setShowCreateModal(true)}>
            <Plus size={32} color="#fff" strokeWidth={3} />
          </TouchableOpacity>
        </>
      )}
      <ActivityCreate
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleActivityCreated}
      />
    </View>
  );
}
