import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {colors} from '../../../theme/colors';
import AchievementImage from '../../../assets/Achievement.png';
import {useUser} from '../../../context/UserContext';

export default function Achievements() {
  const {state} = useUser();
  const achievements = state.user?.achievements ?? [];

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / 2 - 48;

  const renderAchievement = ({item}: {item: any}) => (
    <View style={[styles.achievementItem, {width: itemWidth}]}>
      <View style={styles.imageWrapper}>
        <Image
          source={AchievementImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.criterion} numberOfLines={2}>
        {item.criterion || item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {achievements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você não possui conquistas</Text>
        </View>
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderAchievement}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          scrollEnabled
          style={{flex: 1}}
          contentContainerStyle={[styles.content, {rowGap: 24}]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#69696915',
    borderRadius: 30,
    padding: 16,
    height: 210,
  },
  content: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  imageWrapper: {
    backgroundColor: '#D9D9D9',
    borderRadius: 55,
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
  },
  criterion: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#999',
    textAlign: 'center',
  },
});
