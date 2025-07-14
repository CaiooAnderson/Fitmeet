import Toast from 'react-native-toast-message';

export function showToast(
  message: string,
  type: 'success' | 'error' = 'success',
) {
  Toast.show({
    type,
    text1: message,
    position: 'top',
    visibilityTime: 2500,
  });
}

export default Toast;
