import {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {colors} from '../theme/colors';
import {useFormContext} from 'react-hook-form';

type Props = {
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
};

export default function DatePicker({label, value, onChange, error}: Props) {
  const [internalDate, setInternalDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  const {setError} = useFormContext();

  useEffect(() => {
    if (value) {
      setInternalDate(value);
      setDateSelected(true);
    } else {
      setInternalDate(null);
      setDateSelected(false);
    }
  }, [value]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!selectedDate) return;

    const updatedDate = new Date(internalDate || new Date());

    if (mode === 'date') {
      updatedDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setInternalDate(updatedDate);
      setMode('time');
      setShow(true);
    } else {
      updatedDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());

      const now = new Date();
      if (updatedDate < now) {
        setShow(false);
        setError('scheduledDate', {
          type: 'manual',
          message: 'Escolha um horário futuro.',
        });
        return;
      }

      setInternalDate(updatedDate);
      setShow(false);
      setDateSelected(true);
      onChange?.(updatedDate);
    }
  };

  const openPicker = () => {
    setMode('date');
    setShow(true);
  };

  const hasAsterisk = label.includes('*');
  const labelText = label.replace('*', '').trim();

  return (
    <View style={styles.container}>
      {show && (
        <DateTimePicker
          value={internalDate || new Date()}
          mode={mode}
          locale="pt-BR"
          is24Hour
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.labelContainer}>
        <Text style={[styles.label, error && styles.errorLabel]}>
          {labelText}
        </Text>
        {hasAsterisk && <Text style={styles.asterisk}> *</Text>}
      </View>

      <TouchableOpacity onPress={openPicker} activeOpacity={0.8}>
        <View style={[styles.inputBox, error && styles.inputError]}>
          <Text
            style={[
              styles.inputText,
              !dateSelected && {color: colors.placeholder},
              error && {color: colors.warning},
            ]}>
            {dateSelected && internalDate
              ? formatDate(internalDate)
              : 'DD/MM/YYYY HH:MM'}
          </Text>
        </View>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
          Insira uma data futura para a atividade.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.title,
  },
  asterisk: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: colors.warning,
  },
  errorLabel: {
    color: colors.warning,
  },
  inputBox: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: colors.warning,
  },
  inputText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: colors.warning,
    marginTop: 4,
    marginLeft: 4,
  },
});
