import {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Controller, useFormContext} from 'react-hook-form';
import Category from '../../../../components/Category';
import {colors} from '../../../../theme/colors';
import {API_URL} from '../../../../services/api';
import {storage} from '../../../../storage/storage';
import {styles as menuStyles} from '../../menuStyles';

type ActivityType = {
  id: string;
  name: string;
  image?: string;
};

export default function ActivityCategories() {
  const {control} = useFormContext();
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchActivityTypes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={menuStyles.sectionTitle}>CATEGORIAS</Text>

      <Controller
        control={control}
        name="typeId"
        rules={{required: 'Escolha uma categoria para a atividade'}}
        render={({field: {value, onChange}, fieldState: {error}}) => (
          <View style={styles.scrollWrapper}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <>
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
                        selected={value === item.id}
                        onPress={() => onChange(item.id)}
                      />
                    );
                  })}
                </ScrollView>
                {error && (
                  <Text style={{color: 'red', fontSize: 12, marginTop: 6}}>
                    Escolha um tipo de atividade.
                  </Text>
                )}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontFamily: 'BebasNeue-Regular',
    marginBottom: 12,
    color: '#000',
  },
  scrollWrapper: {
    marginVertical: 10,
  },
});
