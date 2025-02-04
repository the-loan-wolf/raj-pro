import { View, Text, Button } from 'react-native'
import React from 'react'
import { Tabs, router } from 'expo-router'
import { Feather, AntDesign } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function _layout() {
  return (
   <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#FADA7A' />}}>
     <Tabs.Screen name='index' options={{
      tabBarIcon: ({color}) => (
        <AntDesign name="user" size={24} color={color} />
      ),
      tabBarLabel: 'Home',
      headerTitle: 'Welcome Student '
    }} />
    <Tabs.Screen name='features' options={{
      tabBarIcon: ({color}) => (
        <Feather name="list" size={24} color={color} />
      ),
      tabBarLabel: 'Profile',
      headerTitle: 'Hello Raj Kumar',
      
    }} />
    <Tabs.Screen name='profile' options={{
      tabBarIcon: ({color}) => (
        <MaterialIcons name="explore" size={24} color="black" />
      ),
      tabBarLabel: 'Explore',
      headerTitle: 'Profile'
    }} />
    
   </Tabs>
  )
}