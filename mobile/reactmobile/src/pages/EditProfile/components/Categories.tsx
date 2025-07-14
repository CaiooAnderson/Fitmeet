import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Category from '../../../components/Category';
import {colors} from '../../../theme/colors';
import {useUser} from '../../../context/UserContext';
import { SquarePen } from 'lucide-react-native';

interface CategoriesProps {
  title: string;
  data: any[];
  editable?: boolean;
  onEditPress?: () => void;
}

export default function Categories({
  title,
  data,
  editable,
  onEditPress,
}: CategoriesProps) {
  const {state} = useUser();
  const preferences = state.user?.preferences ?? [];

  const filteredData = data.filter(type => preferences.includes(type.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {editable && (
          <TouchableOpacity onPress={onEditPress}>
            <SquarePen size={20} color={colors.title} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredData.length > 0 ? (
          filteredData.map(item => {
            const fixedImageUrl = item.image
              ?.replace('localhost', '10.0.2.2')
              .replace('localstack', '10.0.2.2');

            return (
              <View key={item.id}>
                <Category
                  title={item.name}
                  image={{uri: fixedImageUrl || ''}}
                  variant="text"
                />
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Nenhuma preferência selecionada.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 28,
    color: colors.title,
  },
  emptyText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 24,
  },
});
