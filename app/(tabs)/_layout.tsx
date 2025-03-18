import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Index from '.';
import MyFields from './myFields';
import CropHistory from './cropHistory';

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#461901',
        tabBarStyle: {
          backgroundColor: '#fef3c6',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#78350f',
        },
      }}>
      <Tab.Screen 
        name="index"
        component={Index}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="cropHistory"
        component={CropHistory}
        options={{ tabBarLabel: 'Crop History' }}
      />
      <Tab.Screen
        name="myFields"
        component={MyFields}
        options={{ tabBarLabel: 'My Fields' }}
      />
    </Tab.Navigator>
  );
}
