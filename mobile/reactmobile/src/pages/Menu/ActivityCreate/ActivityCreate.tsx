import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {styles} from './activityCreateStyles';
import Toast from 'react-native-toast-message';

import ImageUpload from './components/ImageUpload';
import Inputs from './components/Inputs';
import Location from './components/Location';
import Private from './components/Private';
import ActivityCategories from './components/ActivityCategories';
import Button from '../../../components/Button';
import {API_URL} from '../../../services/api';
import {storage} from '../../../storage/storage';
import {ChevronLeft} from 'lucide-react-native';

const schema = z.object({
  title: z.string().min(4, 'O título deve ter pelo menos 4 letras.'),
  description: z.string().min(4, 'A descrição deve ter pelo menos 4 letras.'),
  scheduledDate: z.date().refine(date => date > new Date(), {
    message: 'A data deve ser no futuro.',
  }),
  typeId: z.string().uuid(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable()
    .refine(loc => loc !== null && loc.latitude !== 0 && loc.longitude !== 0, {
      message: 'Selecione um local no mapa.',
    }),
  private: z.boolean(),
  image: z
    .string({
      required_error: 'Escolha uma imagem para a sua atividade',
    })
    .min(1, 'Escolha uma imagem para a sua atividade')
    .refine(uri => /\.(jpg|jpeg|png)$/i.test(uri), {
      message:
        'Tipo de formato inválido para imagens. Deve ser .png, .jpg ou .jpeg',
    }),
});

type FormData = z.infer<typeof schema>;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ActivityCreate({visible, onClose, onSuccess}: Props) {
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState<string | null>(null);

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      scheduledDate: undefined,
      typeId: '',
      location: null,
      private: false,
    },
  });

  const {reset} = formMethods;

  useEffect(() => {
    if (!visible) {
      reset();
      setImage(null);
    }
  }, [visible]);

  async function handleSave(data: FormData) {
    if (!image) {
      formMethods.setError('image', {
        type: 'manual',
        message: 'Escolha uma imagem para a sua atividade',
      });
      return;
    }

    const token = await storage.getItem('token');
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('scheduledDate', data.scheduledDate.toISOString());
    formData.append('typeId', data.typeId);
    formData.append('private', String(data.private));
    formData.append('address', JSON.stringify(data.location));

    formData.append('image', {
      uri: image,
      name: 'activity.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch(`${API_URL}/activities/new`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`},
      body: formData,
    });

    if (response.ok) {
      onSuccess?.();
      onClose();
    } else {
      Toast.show({type: 'error', text1: 'Erro ao criar atividade'});
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent>
      <View
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === 'android' ? insets.top + 10 : insets.top,
            paddingBottom: insets.bottom,
          },
        ]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CADASTRAR ATIVIDADE</Text>
          <View style={{width: 28}} />
        </View>

        <FormProvider {...formMethods}>
          <ScrollView contentContainerStyle={styles.content}>
            <ImageUpload image={image} onSelect={setImage} />
            <Inputs />
            <Location />
            <Private />
            <ActivityCategories />
            <Button
              title="Salvar"
              onPress={formMethods.handleSubmit(handleSave)}
            />
          </ScrollView>
        </FormProvider>
      </View>
    </Modal>
  );
}
