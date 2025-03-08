import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useAuth } from './context/AuthContext';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import background from '@/assets/images/bg-img.jpg';
import { Link, useRouter } from 'expo-router';

const Index = () => {
  const { userRole } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (userRole === 'supervisor') {
  //     router.replace('/SupervisorHome');
  //   } else if (userRole === 'worker') {
  //     router.replace('/WorkerHome');
  //   }
  // }, [userRole]);

  return (
    <View style={styles.container}>
      {/* <ImageBackground source={background} style={styles.image} blurRadius={5}> */}
        <View style={styles.contentContainer}>
          <Link href="/SupervisorLogin">
            <View style={styles.loginBox}>
              <View style={styles.innerBox}>
                <Ionicons name="person" size={40} color="white" />
                <Text style={styles.loginText}>Login As Supervisor</Text>
              </View>
            </View>
          </Link>

          <Link href="/WorkerLogin">
            <View style={styles.loginBox2}>
              <View style={styles.innerBox}>
                <Ionicons name="people" size={40} color="white" />
                <Text style={styles.loginText}>Login As Worker</Text>
              </View>
            </View>
          </Link>
        </View>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loginBox: {
    width: 300,
    height: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90, 19, 255, 0.94)", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginBox2: {
    width: 300,
    height: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(19, 94, 255, 0.94)", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerBox: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
    borderRadius: 10,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 10, // Add spacing between icon and text
  },
});

export default Index;
