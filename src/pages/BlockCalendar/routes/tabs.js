import React from 'react';
import ListBlockCalendar from '../index';
import BlockCalendarForm from '../components/form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../themes/theme.json'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
const Tab = createMaterialBottomTabNavigator();

export default function BlockCalendarTabs() {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: theme.colors.primary }}
      activeColor='white'
      inactiveColor='#d3d3d3'
      activeIndicatorStyle={{
        backgroundColor: '#d3d3d3'
      }}
    >
      <Tab.Screen
        name="ListBlockCalendar"
        component={ListBlockCalendar}
        options={{
          tabBarLabel: 'Bloqueios',
          tabBarIcon: () => (
            <Icon name="calendar-lock" color={theme.colors.white} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="BlockCalendarForm"
        component={BlockCalendarForm}
        options={{
          tabBarLabel: 'Novo Bloqueio',
          tabBarIcon: () => (
            <Icon name="calendar-plus" color={theme.colors.white} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 