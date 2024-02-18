// HomeScreen.tsx
import React from 'react';
import {View, Text, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button title="Go to Form" onPress={() => navigation.navigate('Form')} />
    </View>
  );
};

export default HomeScreen;
