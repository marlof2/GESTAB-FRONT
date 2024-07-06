import React, { useContext, useState } from 'react';
import { Appbar, Divider, Menu, MD3LightTheme, Text } from 'react-native-paper';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native';
// import theme from "../../themes/theme.json"
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function Header({ title, subtitle = null, showBack = true, showMenu = false }) {
    const navigation = useNavigation()
    const [menuVisible, setMenuVisible] = useState(false);
    const { signOut } = useContext(AuthContext)

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const IconMenu = () => {
        if (showMenu) {
            return (
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
                >
                    <Menu.Item dense leadingIcon="account" title="Perfil" />
                    <Divider />
                    <Menu.Item dense leadingIcon="exit-to-app" onPress={signOut} title="Sair" />
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
            <Appbar.Header elevated style={{borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                {IconBack()}
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    {
                        subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : ''
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
        paddingLeft: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: 'grey',
    },
});
