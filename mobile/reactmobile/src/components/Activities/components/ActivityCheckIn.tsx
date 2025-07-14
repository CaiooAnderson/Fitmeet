import {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import {colors} from '../../../theme/colors';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useActivity} from '../../../context/ActivityContext';

interface Props {
  activityId: string;
  isCreator?: boolean;
  confirmationCode?: string;
  confirmedAt?: string | null;
}

export default function ActivityCheckIn({
  activityId,
  isCreator = true,
  confirmationCode,
  confirmedAt,
}: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const {checkIn} = useActivity();

  useEffect(() => {
    if (confirmedAt) setConfirmed(true);
  }, [confirmedAt]);

  async function handleCheckIn() {
    if (code.trim() === '') {
      setError('Digite o código');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await checkIn(activityId, code);

      setConfirmed(true);
      Toast.show({
        type: 'success',
        text1: 'Presença confirmada',
      });
    } catch {
      setError('Código inválido');
    } finally {
      setLoading(false);
    }
  }

  if (isCreator && confirmationCode) {
    return (
      <View style={styles.participantContainer}>
        <Text style={styles.codeLabel}>Código de Confirmação</Text>
        <Text style={styles.codeValue}>{confirmationCode}</Text>
      </View>
    );
  }

  if (confirmed) {
    return (
      <Text style={{color: colors.primary, marginTop: 12, fontSize: 16}}>
        Presença confirmada com sucesso!
      </Text>
    );
  }

  return (
    <View>
      <Input
        label="Código de Confirmação"
        value={code}
        onChangeText={setCode}
        placeholder="Digite o código"
        error={error}
      />
      <Button
        title={loading ? 'Confirmando...' : 'Confirmar Presença'}
        onPress={handleCheckIn}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
  },
  participantContainer: {
    backgroundColor: '#69696910',
    height: 86,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  codeLabel: {
    fontFamily: 'DMSans-Semibold',
    fontSize: 16,
    color: colors.title,
    marginBottom: 12,
  },
  codeValue: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 'auto',
  },
});
