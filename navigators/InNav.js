import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Menu from "../src/screens/Menu";

const Nav = createNativeStackNavigator();

const InNav = () => <Nav.Navigator>
    <Nav.Screen name = "Menu" component={Menu} />
</Nav.Navigator>


export default InNav;