import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: colors.title,
    textAlign: 'center',
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 80,
  },
  inputsBlock: {
    gap: 16,
  },
  preferencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  preferencesTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 20,
    color: colors.title,
  },
  saveButton: {
    marginTop: 32,
    marginBottom: 16,
  },
  deactivateText: {
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.title,
  },
});
