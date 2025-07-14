import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Controller, useFormContext} from 'react-hook-form';

export default function Private() {
  const {control} = useFormContext();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Visibilidade</Text>
      <Controller
        control={control}
        name="private"
        defaultValue={false}
        render={({field: {value, onChange}}) => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                value ? styles.unselected : styles.selected,
              ]}
              onPress={() => onChange(false)}>
              <Text
                style={[
                  styles.buttonText,
                  value ? styles.unselectedText : styles.selectedText,
                ]}>
                Público
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                value ? styles.selected : styles.unselected,
              ]}
              onPress={() => onChange(true)}>
              <Text
                style={[
                  styles.buttonText,
                  value ? styles.selectedText : styles.unselectedText,
                ]}>
                Privado
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    color: '#000',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#000',
  },
  unselected: {
    backgroundColor: '#69696910',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#000',
  },
});
