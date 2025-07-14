import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../theme/colors';
import MinhaImagem from '../../../assets/Achievement.png';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../routes/types';
import {useUser} from '../../../context/UserContext';
import {storage} from '../../../storage/storage';
import {ChevronLeft, LogOut, SquarePen} from 'lucide-react-native';

type Props = {
  name: string;
  avatar?: string;
};

export default function ProfileHeader({name, avatar}: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {dispatch, setIsAuthenticated} = useUser();

  const handleSignOut = async () => {
    try {
      await storage.removeItem('token');
      dispatch({type: 'CLEAR_USER'});
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftBlock}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar">
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerBlock}>
          <Text style={styles.title}>PERFIL</Text>
        </View>

        <View style={styles.rightBlock}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil">
            <SquarePen size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sair"
            style={{marginLeft: 12}}>
            <LogOut size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.avatarBlock}>
        <Image
          source={
            avatar
              ? {
                  uri: avatar
                    .replace('localhost', '10.0.2.2')
                    .replace('localstack', '10.0.2.2'),
                }
              : MinhaImagem
          }
          style={styles.avatar}
        />
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 276,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 50,
    paddingHorizontal: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftBlock: {
    width: 60,
    alignItems: 'flex-start',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBlock: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 32,
    fontFamily: 'BebasNeue-Regular',
    color: '#000',
  },
  avatarBlock: {
    marginTop: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  name: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
});
