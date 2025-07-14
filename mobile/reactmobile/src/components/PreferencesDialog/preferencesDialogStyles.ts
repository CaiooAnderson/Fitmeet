import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingHorizontal: 48,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 28,
    color: colors.title,
    textAlign: 'left',
    marginBottom: 40,
  },
  contentBlock: {
    alignItems: 'center',
  },
  activitiesContainer: {
    paddingBottom: 40,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 40,
  },
  activityItem: {
    alignItems: 'center',
    width: 120,
  },
  activityImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: colors.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  activityName: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '500',
    color: colors.title,
    textAlign: 'center',
    maxWidth: 120,
  },
  buttonsBlock: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 48,
    height: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
