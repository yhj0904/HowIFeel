import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from './src/screens/Menu';
import OutNav from './navigators/OutNav';
import AuthContext from './src/contexts/AuthContext';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=> {

    const retrieveLoginState = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        if (value === 'true') {

          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    retrieveLoginState();
    },[]);

console.log(isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
    <NavigationContainer>
     {isLoggedIn ? <Menu /> : <OutNav  /> }
    </NavigationContainer>
    </AuthContext.Provider>
  );
}