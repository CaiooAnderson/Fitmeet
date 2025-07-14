import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: colors.title,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 18,
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 28,
    color: colors.title,
  },
  emptyText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
