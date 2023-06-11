import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MedicationSearchScreen from "../src/screens/MedicationSearchScreen";
import MedicationScreen from "../src/screens/MedicationScreen";

const StackNav = createNativeStackNavigator();

const MediNav = () => (
  <StackNav.Navigator>
    <StackNav.Screen
      name="Medication"
      component={MedicationScreen}
      options={{
        headerShown: false,
      }}
    />
    <StackNav.Screen
      name="MedicationSearchScreen"
      component={MedicationSearchScreen}
      options={{
        headerShown: false,
      }}
    />
  </StackNav.Navigator>
);

export default MediNav;
