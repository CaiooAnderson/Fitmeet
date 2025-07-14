import {StatusBar} from 'react-native';
import {UserProvider} from './src/context/UserContext';
import Routes from './src/routes/Routes';
import Toast from 'react-native-toast-message';
import {ActivityProvider} from './src/context/ActivityContext';

export default function App() {
  return (
    <UserProvider>
      <ActivityProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <Routes />
        <Toast />
      </ActivityProvider>
    </UserProvider>
  );
}
