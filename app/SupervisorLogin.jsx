import React, { useState } from 'react';
import { View, Text, TextInput,Image, TouchableOpacity, StyleSheet, Alert, ImageBackground,ActivityIndicator } from 'react-native';
import background from '@/assets/images/lg-bg.jpg';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { SafeAreaView ,SafeAreaProvider} from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

async function storeSave(key, value) {
  await SecureStore.setItemAsync(key, value);
}




const SupervisorLogin = () => {
    // const { userRole } = useAuth();
    const router = useRouter();
  
    // useEffect(() => {
    //   if (userRole === 'officer') {
    //     router.replace('/SupervisorHome');
    //   } else if (userRole === 'Worker') {
    //     router.replace('/WorkerHome');
    //   }
    // }, [userRole]);
  const apiUrl = 'https://magicminute.online/api';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [midOrPassword, setMidOrPassword] = useState('');
  const [isLoading, setisLoading] = useState(false)

  const handleLogin = async () => {
    setisLoading(true);
    if (!email || !midOrPassword) {
      Alert.alert('Error', 'Please enter both Email and Password');
      return;
    }

    try {
      const logdata = {
        email: email,
        password: midOrPassword,
      };

      const response = await fetch(apiUrl + '/v1/auth/officer/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logdata),
      });

      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        await login('supervisor'); 
        await storeSave("JWT-Token", data.access_token)
        router.replace('/SupervisorHome'); 
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later .');
      console.log(error);
      
    }
    setisLoading(false)
  };

  return (
    <ImageBackground source={background} style={styles.image} blurRadius={1}>
      <View style={styles.container}>
       <View style={styles.imgCn}>
             <Image source={require('@/assets/images/app-icon.jpg')}style={styles.logo} />
                {isLoading &&
                   <SafeAreaProvider>
                   <SafeAreaView style={[styles.load, styles.horizontal]}>
                     <ActivityIndicator size="large" color="blue"/>
                   </SafeAreaView>
                 </SafeAreaProvider>
             
                 }
             </View>
        <Text style={styles.title}>Supervisor Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
  },  imgCn:{
    height:200,
    width:"80%",
    marginBottom:"20",
  },
  logo:{
    height:"100%",
    width:"100%",
    resizeMode:"cover",
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
  },load: {
    flex: 1,
    justifyContent: 'center',
    zIndex:99,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default SupervisorLogin;