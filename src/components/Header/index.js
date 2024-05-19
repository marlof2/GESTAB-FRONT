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
            <Appbar.Header >
                <Icon style={{ marginLeft: 10, marginRight: 15 }} name="menu" size={28}  onPress={() => navigation.openDrawer()} />
                <Appbar.Content  title={title} />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON}  onPress={openMenu} />}
                >
                    <Menu.Item dense leadingIcon="exit-to-app" onPress={signOut} title="Sair" icon="information"  />
                </Menu>
            </Appbar.Header>
        </SafeAreaView>
    )
}
