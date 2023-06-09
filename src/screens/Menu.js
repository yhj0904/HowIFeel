import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Calendar from '../components/MyCalendar.js';
import Medication from '../screens/MedicationScreen';
import Chatbot from '../screens/ChatbotScreen';
import MyInfo from '../screens/MyInfoScreen';
import ContactUs from '../screens/ContactUsScreen';
import AuthContext from '../contexts/AuthContext';
import MemberInfoScreen from './MemberInfoScreen.js';
import 'react-native-gesture-handler';
import Tabs from '../../navigators/Tabs.js';


function MyInfoScreen() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {isLoggedIn ? <MemberInfoScreen /> : <MyInfo />}
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


export default function Menu() {
 
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home 🏡" component={Tabs} />
      <Drawer.Screen name="약물관리 💊" component={Medication} />
      <Drawer.Screen name="챗봇 🤖" component={Chatbot} />
      <Drawer.Screen name="내정보 📋" component={MyInfoScreen} />
      <Drawer.Screen name="문의하기 ✉️" component={ContactUs} />
    </Drawer.Navigator>
  );
}
