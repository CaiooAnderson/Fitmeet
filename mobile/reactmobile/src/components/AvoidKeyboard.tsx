import {ReactNode, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface AvoidKeyboardProps {
  children: ReactNode;
}

export default function AvoidKeyboard({children}: AvoidKeyboardProps) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOffset(Platform.OS === 'ios' ? 0 : 25);
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardOffset}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.inner}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
