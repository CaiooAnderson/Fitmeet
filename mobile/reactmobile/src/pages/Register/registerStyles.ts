import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  backIcon: {
    marginBottom: 60,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: colors.title,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.text,
    marginBottom: 32,
    width: 256,
  },
  form: {
    gap: 24,
  },
  field: {
    marginBottom: 0,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
  },
  required: {
    color: colors.warning,
  },
  error: {
    color: colors.warning,
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: colors.title,
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: colors.text,
  },
  link: {
    fontFamily: 'DMSans-Bold',
    color: colors.text,
  },
});
