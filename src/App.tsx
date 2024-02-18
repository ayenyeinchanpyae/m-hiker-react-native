// App.tsx
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import CustomTabBar from '../CustomTabBar';
import AddHikeScreen from './Screens/AddHikeScreen';
import HikeListScreen from './Screens/HikeListScreen';
import EditHikeScreen from './Screens/EditHikeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HikeListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditHikeScreen"
        component={EditHikeScreen}
        options={{
          title: 'Edit Hike Screen',
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddHikeScreen}
          options={{
            tabBarLabel: 'Add',
          }}
        />
        {/* Add more Tab.Screen components as needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
