import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {colors} from '../../../theme/colors';
import Toast from 'react-native-toast-message';
import { Camera } from 'lucide-react-native';

interface EditAvatarProps {
  avatar?: string;
  onChangeAvatar: (uri: string) => void;
}

export default function EditAvatar({avatar, onChangeAvatar}: EditAvatarProps) {
  const fixedUri = avatar
    ?.replace('localhost', '10.0.2.2')
    .replace('localstack', '10.0.2.2');

  const handlePickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const uri = asset.uri;
      const type = asset.type;

      if (!uri || !type) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(type)) {
        Toast.show({
          type: 'error',
          text1: 'Formato inválido',
          text2: 'Apenas imagens JPG, JPEG ou PNG são permitidas.',
        });
        return;
      }

      onChangeAvatar(uri);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro ao abrir galeria',
        text2: 'Não foi possível abrir a galeria de imagens.',
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePickImage}>
      <View style={styles.circle}>
        {fixedUri ? (
          <Image source={{uri: fixedUri}} style={styles.avatar} />
        ) : null}
        <View style={styles.iconOverlay}>
          <Camera size={48} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 16,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  iconOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
