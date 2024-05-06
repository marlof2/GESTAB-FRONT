import React, { useContext, useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Platform, SafeAreaView } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

import theme from '../../themes';

export default function Header({ title }) {

    const [menuVisible, setMenuVisible] = useState(false);

    const { signOut } = useContext(AuthContext)
    
    const navigation = useNavigation()
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <SafeAreaView>
            <Appbar.Header style={{backgroundColor:theme.light.colors.primary}}>
                <Icon style={{ marginLeft: 10, marginRight: 15 }} name="menu" size={28} color={theme.light.colors.iconHeader} onPress={() => navigation.openDrawer()} />
                <Appbar.Content color={theme.light.colors.iconHeader} title={title} />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON} color={theme.light.colors.iconHeader} onPress={openMenu} />}
                >
                    <Menu.Item dense leadingIcon="exit-to-app" onPress={signOut} title="Sair" icon="information" color={theme.light.colors.iconHeader} />
                </Menu>
            </Appbar.Header>
        </SafeAreaView>
    )
}
