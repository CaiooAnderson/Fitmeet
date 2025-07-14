import {View, StyleSheet} from 'react-native';
import {useFormContext, Controller} from 'react-hook-form';
import Input from '../../../../components/Input';
import DatePicker from '../../../../components/DatePicker';

export default function Inputs() {
  const {control} = useFormContext();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Input
            label="Título *"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Input
            label="Descrição *"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="scheduledDate"
        rules={{required: 'Escolha uma data para o evento'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <DatePicker
            label="Data do Evento *"
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: '100%',
  },
});
