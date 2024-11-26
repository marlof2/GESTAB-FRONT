import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Avatar, Surface, useTheme, List, Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Header from '../../components/Header';
import { helper } from '../../helpers/inputs';
// import { AuthContext } from '../../contexts/auth';
import { useIsFocused } from '@react-navigation/native'
import api from '../../services';
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';


export default function UserProfileView({ navigation }) {
  // const { name, cpf, email, phone } = route.params.dataUser;
  // const { loadStorage } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [user, setUser] = useState(null)
  const theme = useTheme();

  async function me() {
    const response = await api.get('/me')

    if (response.status == 401) {
      await AsyncStorage.clear();
      navigation.navigate('SignIn')
      setUser(null);
    }

    if (response.status == 200) {
      setUser(response.data.user);
    }


  }

  useEffect(() => {
    if (isFocused) {
      me()
    }

    return () => { }

  }, [isFocused])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Perfil" />

      {/* Profile Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}
      >
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={70}
            label={user?.name?.[0]}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={2}>
              {user?.name}
            </Text>
            {user?.type_schedule && (
              <>
                <Text style={[styles.label, { color: 'rgba(255,255,255,0.7)' }]}>
                  Tipo de agenda:
                </Text>
                <Text style={styles.userType}>
                  {helper.formatTypeSchedule(user.type_schedule)}
                </Text>
              </>
            )}
          </View>
        </View>
      </Animated.View>

      {/* User Info Card */}
      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <Surface style={styles.infoCard}>
          <View style={styles.infoRow}>
            <List.Icon icon="card-account-details-outline" color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.value}>{helper.maskCpf(user?.cpf) || 'Carregando...'}</Text>
              <Text style={styles.label}>CPF</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <List.Icon icon="email-outline" color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.value}>{user?.email || 'Carregando...'}</Text>
              <Text style={styles.label}>E-mail</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <List.Icon icon="phone-outline" color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.value}>{helper.maskPhone(user?.phone) || 'Carregando...'}</Text>
              <Text style={styles.label}>Celular</Text>
            </View>
          </View>
        </Surface>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        style={styles.quickActions}
        entering={FadeInUp.delay(200).springify()}
      >
        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('FormProfile', { user })}
        >
          <List.Icon icon="pencil-outline" color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>Editar Perfil</Text>
        </Pressable>
        <View style={styles.actionDivider} />
        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('FomPasswordChange', { user })}
        >
          <List.Icon icon="lock-outline" color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>Alterar Senha</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('FomPasswordChange', { user })}
        >
          <List.Icon icon="account-cancel-outline" color="#ff4444" />
          <Text style={styles.dangerText}>Inativar Conta</Text>
        </Pressable>
      </Animated.View>


      <BannerAdComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flexWrap: 'wrap',
  },
  userType: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 8,
    elevation: 2,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    padding: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dangerText: {
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});

