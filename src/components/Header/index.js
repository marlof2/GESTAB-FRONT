import React, { useState } from 'react';
import { Appbar, Divider, Menu, MD3LightTheme, Text } from 'react-native-paper';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native';
// import theme from "../../themes/theme.json"
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function Header({ title, subtitle = null, description = null, showBack = true, showMenu = false, children }) {
    const navigation = useNavigation()
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const IconMenu = () => {
        if (showMenu) {
            return (
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
                    contentStyle={styles.menuContent}
                    anchorPosition="bottom"
                >
                    {children}
                </Menu>
            )
        }
    }

    const IconBack = () => {
        if (showBack) {
            return (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            )
        }
    }

    return (
        <SafeAreaView>
            <Appbar.Header elevated style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop:10 }}>
                {IconBack()}
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    {
                        subtitle && (<Text style={styles.subtitle}>{subtitle}</Text>)
                    }
                    {
                        description && (<Text style={styles.subtitle}>{description}</Text>)
                    }
                </View>
                {IconMenu()}
            </Appbar.Header>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingBottom: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: 'grey',
    },
    menuContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});