import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuButton = ({ navigation }) => {
  const openMenu = () => {
    navigation.toggleDrawer(); 
  };

  return (
    <TouchableOpacity onPress={openMenu}>
      <View style={styles.icon}>
        <Icon name="menu-outline" size={32} color="black" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 20,
  },
});

export default MenuButton;