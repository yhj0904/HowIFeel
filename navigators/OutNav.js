import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "../src/screens/Login";
import Join from "../src/screens/Join";
import Menu from "../src/screens/Menu";
import MemberInfoScreen from "../src/screens/MemberInfoScreen";
import Tabs from "./Tabs";

const Nav = createNativeStackNavigator();

const OutNav = ({ handleLogin }) => (
  <Nav.Navigator initialRouteName="Login">
    <Nav.Screen name="Login" component={Login} initialParams={{ handleLogin }} />
    <Nav.Screen name="Join" component={Join} />
    <Nav.Screen name="Menu" component={Menu} options={{
      headerShown:false,
    }}/>
    <Nav.Screen name="MemberInfoScreen" component={MemberInfoScreen} />
  </Nav.Navigator>
);

export default OutNav;
