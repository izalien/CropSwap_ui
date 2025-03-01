import { Stack } from "expo-router";
import "../global.css" 
import React from "react";
import { createStackNavigator } from 'react-navigation-stack';
import Index from "./(tabs)/index";

const RouteConfigs = {
  Index: {
    screen: Index,
    path: 'index',
  },
};

const StackNavigatorConfig = {
  initialRouteName: 'Index',
};

const Navigator = createStackNavigator(RouteConfigs, StackNavigatorConfig);

export default function RootLayout() {

  return( 
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
    </Stack>
  );
}

