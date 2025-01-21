import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

const HeaderContainer = styled.View`
  padding: 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const NavigationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const PageTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
`;

const PageDescription = styled.Text`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primary}10;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 8px;
`;

export function PageHeader({ 
  title, 
  description, 
  backTo,
  actions,
  itemsCount 
}) {
  const navigation = useNavigation();

  return (
    <HeaderContainer>
      <NavigationRow>
        {backTo && (
          <TouchableOpacity 
            onPress={() => navigation.navigate(backTo)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon name="arrow-left" size={20} color="#666" />
            <Text style={{ marginLeft: 4, color: '#666' }}>Voltar</Text>
          </TouchableOpacity>
        )}
      </NavigationRow>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          <PageTitle>{title}</PageTitle>
          {description && <PageDescription>{description}</PageDescription>}
          {itemsCount !== null && (
            <Text style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
              {itemsCount} {itemsCount === 1 ? 'registro' : 'registros'}
            </Text>
          )}
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          {actions?.map((action, index) => (
            <ActionButton key={index} onPress={action.onPress}>
              <Icon name={action.icon} size={18} color={action.color || '#666'} />
              <Text style={{ marginLeft: 4, color: '#666' }}>{action.label}</Text>
            </ActionButton>
          ))}
        </View>
      </View>
    </HeaderContainer>
  );
} 