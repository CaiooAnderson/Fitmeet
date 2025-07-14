import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {RootStackParamList} from '../../routes/types';
import {styles} from './registerStyles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {API_URL} from '../../services/api';
import Toast from 'react-native-toast-message';
import {ChevronLeft} from 'lucide-react-native';

const registerSchema = z.object({
  name: z
    .string()
    .min(6, 'O nome deve ter pelo menos 6 caracteres.')
    .refine(val => !/\s{2,}/.test(val), {
      message: 'Use apenas um espaço entre palavras.',
    }),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos numéricos.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .regex(/^\S*$/, 'A senha não pode conter espaços.'),
});

type Navigation = StackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const navigation = useNavigation<Navigation>();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: any) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Conta criada com sucesso!',
        });
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        Toast.show({
          type: 'error',
          text1: errorData.error || 'Erro inesperado ao cadastrar.',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro ao conectar com o servidor.',
      });
    }
  }

  function formatCpf(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backIcon}>
                <ChevronLeft size={28} color="#000" strokeWidth={3} />
              </TouchableOpacity>

              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Por favor preencha os dados para prosseguir!
              </Text>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Controller
                    control={control}
                    name="name"
                    render={({field: {onChange, value}}) => (
                      <Input
                        label="Nome Completo *"
                        placeholder="Ex.: Caio Anderson"
                        value={value}
                        onChangeText={onChange}
                        error={errors.name?.message}
                      />
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Controller
                    control={control}
                    name="cpf"
                    render={({field: {onChange, value}}) => (
                      <Input
                        label="CPF *"
                        placeholder="Ex.: 123.456.789-00"
                        value={formatCpf(value)}
                        keyboardType="numeric"
                        onChangeText={text => onChange(text.replace(/\D/g, ''))}
                        error={errors.cpf?.message}
                      />
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                      <Input
                        label="E-mail *"
                        placeholder="Ex.: caio@gmail.com"
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        autoComplete="off"
                        error={errors.email?.message}
                      />
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                      <Input
                        label="Senha *"
                        placeholder="Ex.: 123456"
                        autoCapitalize="none"
                        autoComplete="off"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        error={errors.password?.message}
                      />
                    )}
                  />
                </View>

                <Button
                  title="Cadastrar"
                  onPress={handleSubmit(onSubmit)}
                  style={{marginTop: 24}}
                />
              </View>

              <Text style={styles.footer}>
                Já possui uma conta?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Login')}>
                  Login
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
