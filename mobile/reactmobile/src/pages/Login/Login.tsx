import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useState} from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FrameImage from '../../assets/Frame.png';

import {RootStackParamList} from '../../routes/types';
import {styles} from './loginStyles';
import {API_URL} from '../../services/api';
import {storage} from '../../storage/storage';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';
import {useUser} from '../../context/UserContext';

type Navigation = StackNavigationProp<RootStackParamList, 'Login'>;

const gradientColors = ['#00bc7d', '#009966'];
const gradientDirection = {x: 0, y: 1};
const gradientEndDirection = {x: 0, y: 0};

export default function Login() {
  const navigation = useNavigation<Navigation>();
  const {refreshUser} = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        if (token) {
          await storage.setItem('token', token);
          await refreshUser();

          const userRes = await fetch(`${API_URL}/user`, {
            headers: {Authorization: `Bearer ${token}`},
          });

          const user = await userRes.json();
          const userPrefsKey = `userData:${user.id}`;
          const existingPrefs = await AsyncStorage.getItem(userPrefsKey);

          if (!existingPrefs) {
            await AsyncStorage.setItem(
              userPrefsKey,
              JSON.stringify({preferenciasSalvas: false}),
            );
          }

          navigation.reset({
            index: 0,
            routes: [{name: 'Menu'}],
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Token não recebido.',
          });
        }
      } else {
        const errorData = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: errorData.error || 'Erro ao fazer login.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao conectar com o servidor.',
      });
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[styles.container, {flexGrow: 1}]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={gradientColors}
                start={gradientDirection}
                end={gradientEndDirection}
                style={styles.iconCircle}>
                <Image
                  source={FrameImage}
                  style={styles.image}
                  resizeMode="contain"
                />
              </LinearGradient>

              <MaskedView
                maskElement={<Text style={styles.logoText}>FITMEET</Text>}>
                <LinearGradient
                  colors={gradientColors}
                  start={gradientDirection}
                  end={gradientEndDirection}
                  style={{
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}>
                  <Text style={[styles.logoText, {opacity: 0}]}>FITMEET</Text>
                </LinearGradient>
              </MaskedView>
            </View>

            <Text style={styles.title}>FAÇA LOGIN E COMECE A TREINAR</Text>
            <Text style={styles.subtitle}>
              Encontre parceiros para treinar ao{'\n'}ar livre. Conecte-se e
              comece{'\n'}agora! 💪
            </Text>

            <Input
              label="E-mail *"
              placeholder="Ex.: caio@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="off"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Senha *"
              placeholder="Ex.: 123456"
              autoCapitalize="none"
              autoComplete="off"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{marginTop: 16}}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              style={{marginTop: 24}}
            />

            <Text style={styles.footerText}>
              Ainda não tem uma conta?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Register')}>
                Cadastre-se
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
