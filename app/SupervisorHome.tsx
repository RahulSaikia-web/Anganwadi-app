import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SupervisorHome = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('index'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supervisor Dashboard</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SupervisorHome;
