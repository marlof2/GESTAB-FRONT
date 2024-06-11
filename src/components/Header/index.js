import React, { useContext, useState } from 'react';
import { Appbar, Divider, Menu, MD3LightTheme } from 'react-native-paper';
import { Platform, SafeAreaView } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native'
// import theme from "../../themes/theme.json"
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function Header({ title, showBack = true, showMenu = false }) {
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
            <Appbar.Header elevated>
                {IconBack()}
                <Appbar.Content title={title}  />
                {IconMenu()}
            </Appbar.Header>
        </SafeAreaView>
    )
}
