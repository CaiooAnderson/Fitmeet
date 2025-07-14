import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useUser} from '../context/UserContext';

import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Menu from '../pages/Menu/Menu';
import ActivitiesByTypes from '../pages/ActivitiesByTypes/ActivitiesByTypes';
import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/EditProfile/EditProfile';
import Splash from '../components/Splash';
import {RootStackParamList} from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const {isAuthenticated, isLoading} = useUser();

  if (isLoading) {
    return <Splash onFinish={() => {}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen
              name="ActivitiesByTypes"
              component={ActivitiesByTypes}
              options={({route}) => ({
                headerShown: false,
                key: route?.params?.typeId || 'ActivitiesByTypes',
              })}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
