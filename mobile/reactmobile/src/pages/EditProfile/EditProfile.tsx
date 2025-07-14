import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import EditAvatar from './components/EditAvatar';
import Input from '../../components/Input';
import Categories from './components/Categories';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {useEffect, useState} from 'react';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import PreferencesDialog from '../../components/PreferencesDialog/PreferencesDialog';
import Toast from 'react-native-toast-message';
import {useUser} from '../../context/UserContext';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from './editProfileStyles';
import {
  updateUserAvatar,
  updateUserPreferences,
  updateUserProfile,
  deactivateAccount,
} from '../../services/EditProfileService';
import {ChevronLeft} from 'lucide-react-native';

type UserData = {
  name: string;
  cpf: string;
  email: string;
  avatar: string;
  password?: string;
};

export default function EditProfile() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {state, refreshUser} = useUser();
  const user = state.user;

  const [activityTypes, setActivityTypes] = useState<
    {id: string; name: string; image: string}[]
  >([]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    cpf: '',
    email: '',
    avatar: '',
    password: '',
  });
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);

  const {dispatch, setIsAuthenticated} = useUser();

  const formatCpf = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleUpdateProfile = async () => {
    try {
      const payload: any = {
        name: userData.name,
        email: userData.email,
      };

      if (userData.password?.trim()) {
        payload.password = userData.password;
      }

      await updateUserProfile(payload);

      if (userData.avatar?.startsWith('file://')) {
        await updateUserAvatar(userData.avatar);
      }

      await updateUserPreferences(selectedPreferences);
      await refreshUser();

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado com sucesso!',
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar perfil.',
      });
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount();
      await storage.removeItem('token');

      dispatch({type: 'CLEAR_USER'});
      setIsAuthenticated(false);

      Toast.show({
        type: 'success',
        text1: 'Conta desativada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao desativar conta',
      });
    }
  };

  useEffect(() => {
    if (user?.preferences) {
      setSelectedPreferences(user.preferences);
    }
  }, [user?.preferences]);

  useEffect(() => {
    async function loadUser() {
      const token = await storage.getItem('token');
      const res = await fetch(`${API_URL}/user`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await res.json();
      setUserData(data);
      setSelectedPreferences(data.preferences || []);
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadActivityTypes() {
      try {
        const token = await storage.getItem('token');
        const res = await fetch(`${API_URL}/activities/types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setActivityTypes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de atividade', error);
      }
    }

    loadActivityTypes();
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <ScrollView
            contentContainerStyle={[
              styles.container,
              {
                paddingTop:
                  Platform.OS === 'android' ? insets.top + 20 : insets.top,
                backgroundColor: '#fff',
              },
            ]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeft size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>ATUALIZAR PERFIL</Text>
              <View style={{width: 28}} />
            </View>

            <View style={styles.avatarBlock}>
              <EditAvatar
                avatar={userData.avatar}
                onChangeAvatar={uri =>
                  setUserData(prev => ({...prev, avatar: uri}))
                }
              />
            </View>

            <View style={styles.inputsBlock}>
              <Input
                label="Nome Completo *"
                value={userData?.name}
                onChangeText={text =>
                  setUserData(prev => ({...prev, name: text}))
                }
              />

              <Input
                label="CPF *"
                value={formatCpf(userData?.cpf)}
                editable={false}
              />

              <Input
                label="E-mail *"
                value={userData?.email}
                onChangeText={text =>
                  setUserData(prev => ({...prev, email: text}))
                }
              />

              <Input
                label="Senha *"
                placeholder="Ex.: 123456"
                secureTextEntry
                onChangeText={text =>
                  setUserData(prev => ({...prev, password: text}))
                }
              />
            </View>

            <Categories
              title="PREFERÊNCIAS"
              data={activityTypes}
              editable
              onEditPress={() => setShowPreferencesDialog(true)}
            />

            <Button
              title="Salvar"
              onPress={handleUpdateProfile}
              style={styles.saveButton}
            />

            <TouchableOpacity onPress={handleDeactivateAccount}>
              <Text style={styles.deactivateText}>Desativar Conta</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <PreferencesDialog
        visible={showPreferencesDialog}
        mode="edit"
        initialSelected={selectedPreferences}
        onConfirm={() => setShowPreferencesDialog(false)}
        onSaveLocal={selected => setSelectedPreferences(selected)}
      />
    </>
  );
}
