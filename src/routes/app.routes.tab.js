import React from "react";

import Home from '../pages/Home'
import Schedule from '../pages/Schedule'
import Menu from '../pages/Menu'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../themes/theme.json'

import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
const Tab = createMaterialBottomTabNavigator();

export default function AppRouteStack() {
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
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <Icon name="home" color={theme.colors.white} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="Schedule"
                component={Schedule}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: () => (
                        <Icon name="notebook-outline" color={theme.colors.white} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    tabBarLabel: 'Menu',
                    tabBarIcon: () => (
                        <Icon name="menu"  color={theme.colors.white} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}