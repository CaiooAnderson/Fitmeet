import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../menuStyles';
import MinhaImagem from '../../../assets/Achievement.png';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../routes/types';
import {useUser} from '../../../context/UserContext';
import {Star} from 'lucide-react-native';

export default function MenuHeader() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {state} = useUser();
  const user = state.user;

  return (
    <View style={styles.header}>
      <View style={styles.circleSmall} />
      <View style={styles.circleLarge} />

      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Olá, Seja Bem Vindo</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
          {user?.name ?? 'Carregando...'}!
        </Text>
      </View>

      <View style={styles.avatarBlock}>
        <View style={styles.points}>
          <Star size={16} color="#FFD700" strokeWidth={3} />
          <Text style={styles.pointsText}>{user?.level ?? '-'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={
              user?.avatar
                ? {
                    uri: user.avatar
                      .replace('localhost', '10.0.2.2')
                      .replace('localstack', '10.0.2.2'),
                  }
                : MinhaImagem
            }
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
