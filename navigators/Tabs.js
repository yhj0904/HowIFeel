import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {AntDesign, Octicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Satistics from "../src/screens/StatisticsScreen";
import Advice from "../src/screens/AdviceResultScreen";
import Search from "../src/screens/SearchScreen";
import Calendar from "../src/components/MyCalendar";


const Tab = createBottomTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Satistics"
        component={Satistics}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="graph" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Control"
        component={Advice}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="healing" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name= "calendar-search" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
