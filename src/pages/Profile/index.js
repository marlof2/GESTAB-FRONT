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

      {/* Profile Header - Simplified */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.headerCard]}
      >
        <Avatar.Text
          size={80}
          label={user?.name?.[0]}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName} numberOfLines={2}>
            {user?.name}
          </Text>
          {user?.type_schedule && (
            <Text style={styles.userType}>
              {helper.formatTypeSchedule(user.type_schedule)}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* User Info Card - Simplified */}
      <Animated.View 
        entering={FadeInUp.delay(300).springify()}
        style={styles.infoContainer}
      >
        <Surface style={styles.infoCard}>
          <InfoRow icon="card-account-details-outline" 
            label="CPF"
            value={helper.maskCpf(user?.cpf) || 'Carregando...'}
            theme={theme}
          />
          <InfoRow icon="email-outline" 
            label="E-mail"
            value={user?.email || 'Carregando...'}
            theme={theme}
          />
          <InfoRow icon="phone-outline" 
            label="Celular"
            value={helper.maskPhone(user?.phone) || 'Carregando...'}
            theme={theme}
          />
        </Surface>
      </Animated.View>

      {/* Quick Actions - Redesigned */}
      <Animated.View
        style={styles.quickActions}
        entering={FadeInUp.delay(200).springify()}
      >
        <ActionButton
          icon="pencil-outline"
          label="Editar Perfil"
          onPress={() => navigation.navigate('FormProfile', { user })}
          theme={theme}
        />
        <ActionButton
          icon="lock-outline"
          label="Alterar Senha"
          onPress={() => navigation.navigate('FomPasswordChange', { user })}
          theme={theme}
        />
        <ActionButton
          icon="account-cancel-outline"
          label="Inativar Conta"
          isDanger
          onPress={() => navigation.navigate('FomPasswordChange', { user })}
        />
      </Animated.View>

      <BannerAdComponent />
    </SafeAreaView>
  );
}

// Subcomponents for better organization
const InfoRow = ({ icon, label, value, theme }) => (
  <View style={styles.infoRow}>
    <List.Icon icon={icon} color={theme.colors.primary} />
    <View style={styles.infoText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const ActionButton = ({ icon, label, onPress, theme, isDanger }) => (
  <Pressable
    style={({ pressed }) => [
      styles.actionButton,
      {
        backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : '#fff',
        transform: [{ scale: pressed ? 0.98 : 1 }],
      }
    ]}
    onPress={onPress}
  >
    <Surface style={[
      styles.actionButtonCard,
      { borderColor: isDanger ? '#ff4444' : theme?.colors.primary }
    ]}>
      <List.Icon 
        icon={icon} 
        color={isDanger ? '#ff4444' : theme?.colors.primary} 
      />
      <Text style={[
        styles.actionText, 
        { color: isDanger ? '#ff4444' : theme?.colors.primary }
      ]}>
        {label}
      </Text>
    </Surface>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  infoContainer: {
    paddingHorizontal: 16,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  value: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    maxWidth: '30%',
  },
  actionButtonCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    elevation: 2,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

