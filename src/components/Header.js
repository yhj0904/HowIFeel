import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PsychTestScreen from './PsychTestScreen';
import MedicationScreen from './MedicationScreen';
import ChatbotScreen from './ChatbotScreen';
import MyInfoScreen from './MyInfoScreen';
import ContactUsScreen from './ContactUsScreen';

const Drawer = createDrawerNavigator();

const Header = () => {
  const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openMenu}>
        <Text style={styles.menu}>Menu</Text>
      </TouchableOpacity>
      <Text style={styles.title}>My App</Text>
    </View>
  );
};

export default Header;