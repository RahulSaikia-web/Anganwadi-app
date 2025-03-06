import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import background from '@/assets/images/log-bg.jpg';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

const WorkerLogin = () => {
  let JWT_token;
  const apiUrl = 'https://magicminute.online/api';
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [midOrPassword, setMidOrPassword] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber || !midOrPassword) {
      Alert.alert('Error', 'Please enter both Phone Number and MID/Password');
      return;
    }

    try {
      const logdata = {
        phone: phoneNumber,
        mpin: midOrPassword,
      };

      const response = await fetch(apiUrl + '/v1/auth/staff/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logdata),
      });

      const data = await response.json();
      if (response.ok) {
        await login('worker');
        JWT_token= data.access_token;
                       
        router.replace('/WorkerHome',{
          token:JWT_token,
        });
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ImageBackground source={background} style={styles.image} blurRadius={5}>
      <View style={styles.container}>
        <Text style={styles.title}>Worker Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="MID or Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={midOrPassword}
          onChangeText={setMidOrPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '90%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorkerLogin;