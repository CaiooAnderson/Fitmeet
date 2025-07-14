import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFormContext} from 'react-hook-form';
import {useEffect} from 'react';
import {Camera} from 'lucide-react-native';

type Props = {
  image: string | null;
  onSelect: (uri: string) => void;
};

export default function ImageUpload({image, onSelect}: Props) {
  const {
    setError,
    clearErrors,
    formState: {errors},
    register,
    setValue,
  } = useFormContext();

  useEffect(() => {
    register('image');
  }, [register]);

  const handlePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri || '';
      const isValid = /\.(jpg|jpeg|png)$/i.test(uri);

      if (!isValid) {
        setError('image', {
          type: 'manual',
          message:
            'Tipo de formato inválido para imagens. Deve ser .png, .jpg ou .jpeg',
        });
        return;
      }

      clearErrors('image');
      onSelect(uri);
      setValue('image', uri);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePick}
        activeOpacity={0.8}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} />
        ) : (
          <Camera size={32} color="#000" strokeWidth={3} />
        )}
      </TouchableOpacity>

      {errors.image && (
        <Text style={styles.errorText}>{errors.image.message as string}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 24,
  },
  container: {
    width: '100%',
    height: 205,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
