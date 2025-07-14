import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Toast from 'react-native-toast-message';
import {styles} from '../../../pages/Menu/ActivityCreate/activityCreateStyles';

import ImageUpload from '../../../pages/Menu/ActivityCreate/components/ImageUpload';
import Inputs from '../../../pages/Menu/ActivityCreate/components/Inputs';
import Location from '../../../pages/Menu/ActivityCreate/components/Location';
import Private from '../../../pages/Menu/ActivityCreate/components/Private';
import ActivityCategories from '../../../pages/Menu/ActivityCreate/components/ActivityCategories';
import Button from '../../../components/Button';
import {API_URL} from '../../../services/api';
import {storage} from '../../../storage/storage';
import { ChevronRight } from 'lucide-react-native';

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
    .refine(loc => loc && loc.latitude !== 0 && loc.longitude !== 0, {
      message: 'Selecione um local no mapa.',
    }),
  private: z.boolean(),
  image: z
    .string()
    .min(1, 'Escolha uma imagem para a sua atividade')
    .refine(uri => /\.(jpg|jpeg|png)$/i.test(uri), {
      message: 'Tipo de imagem inválido (.png, .jpg ou .jpeg)',
    }),
});

type FormData = z.infer<typeof schema>;

type Props = {
  visible: boolean;
  onClose: () => void;
  activity: any;
  onSuccess?: () => void;
};

export default function ActivityEdit({
  visible,
  onClose,
  activity,
  onSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState<string | null>(null);

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: activity?.title || '',
      description: activity?.description || '',
      scheduledDate: activity?.scheduledDate
        ? new Date(activity.scheduledDate)
        : undefined,
      typeId: activity?.type || '',
      location: activity?.address || null,
      private: activity?.private || false,
      image: activity?.image || '',
    },
  });

  const {reset, setValue} = formMethods;

  useEffect(() => {
    async function loadAndMapType() {
      if (!activity || !visible) return;

      try {
        const token = await storage.getItem('token');
        const response = await fetch(`${API_URL}/activities/types`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.ok) throw new Error('Erro ao carregar tipos');

        const types = await response.json();
        const matchedType = types.find((t: any) => t.name === activity.type);
        const typeId = matchedType?.id ?? '';

        const fixedImage =
          activity.image
            ?.replace('localhost', '10.0.2.2')
            .replace('localstack', '10.0.2.2') || '';

        reset({
          title: activity.title,
          description: activity.description,
          scheduledDate: new Date(activity.scheduledDate),
          typeId,
          location: activity.address,
          private: activity.private,
          image: fixedImage,
        });

        setImage(fixedImage);
      } catch (err) {
        console.error('Erro ao preparar edição da atividade:', err);
      }
    }

    loadAndMapType();
  }, [activity, visible]);

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

    const response = await fetch(
      `${API_URL}/activities/${activity.id}/update`,
      {
        method: 'PUT',
        headers: {Authorization: `Bearer ${token}`},
        body: formData,
      },
    );

    if (response.ok) {
      Toast.show({type: 'success', text1: 'Atividade atualizada com sucesso!'});
      onSuccess?.();
      onClose();
    } else {
      Toast.show({type: 'error', text1: 'Erro ao atualizar atividade'});
    }
  }

  async function handleDelete() {
    try {
      const token = await storage.getItem('token');
      const response = await fetch(
        `${API_URL}/activities/${activity.id}/delete`,
        {
          method: 'DELETE',
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Atividade cancelada com sucesso!',
        });
        onClose();
        onSuccess?.();
      } else {
        Toast.show({type: 'error', text1: 'Erro ao cancelar atividade'});
      }
    } catch (err) {
      console.error('Erro ao cancelar atividade:', err);
      Toast.show({type: 'error', text1: 'Erro ao cancelar atividade'});
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
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
                <ChevronRight size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>EDITAR ATIVIDADE</Text>
              <View style={{width: 28}} />
            </View>

            <FormProvider {...formMethods}>
              <ScrollView contentContainerStyle={styles.content}>
                <ImageUpload
                  image={image}
                  onSelect={uri => {
                    setImage(uri);
                    setValue('image', uri);
                  }}
                />
                <Inputs />
                <Location />
                <Private />
                <ActivityCategories />
                <Button
                  title="Salvar"
                  onPress={formMethods.handleSubmit(handleSave)}
                />
                <Button
                  title="Cancelar Atividade"
                  variant="ghost"
                  onPress={handleDelete}
                  style={{marginTop: 12}}
                />
              </ScrollView>
            </FormProvider>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
