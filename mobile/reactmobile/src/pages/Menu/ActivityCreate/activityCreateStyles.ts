import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#000',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'DMSans-Regular',
  },
  
});
