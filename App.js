import React, { Component } from "react";
import { TailwindProvider, useTailwind } from "tailwind-rn";
import utilities from "./tailwind.json";

import CityWiseScreen from "./Screens/CityWise.js";
import CurrentweatherScreen from "./Screens/currentweather.js";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Tab.Navigator
          labeled={false}
          barStyle={{ backgroundColor: "#3399FF" }}
          activeColor="black"
        >
          <Tab.Screen
            name="Current"
            component={CurrentweatherScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="CityWise"
            component={CityWiseScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="city" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}
