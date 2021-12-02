
import React from 'react';

import tw from 'tailwind-rn';
import {LogBox} from "react-native"
import { NavigationContainer } from '@react-navigation/native';
LogBox.ignoreAllLogs()
import StackNavigator from './StackNavigator'
import {AuthProvider} from './hooks/useAuth'


export default function App() {
  return (
    <NavigationContainer>
    <AuthProvider >
    <StackNavigator />
    </AuthProvider >
    </NavigationContainer>
  );
}
