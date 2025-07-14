import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {styles} from '../menuStyles';
import {colors} from '../../../theme/colors';
import Category from '../../../components/Category';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../routes/types';

type CategoriesProps = {
  loading: boolean;
  activityTypes: {id: string; name: string; image?: string}[];
  noPadding?: boolean;
};

export default function Categories({loading, activityTypes, noPadding}: CategoriesProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.categorySection, noPadding && { paddingHorizontal: 0 }]}>
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
  );
}
