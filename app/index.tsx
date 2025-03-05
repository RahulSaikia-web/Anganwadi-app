import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React from "react";
import background from "@/assets/images/bg-img.jpg";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.image} blurRadius={5}>
        <View style={styles.contentContainer}>
          {/* Supervisor Login Box */}
          <Link href="/SupervisorLogin" style={styles.loginBox}>
            <View style={styles.innerBox}>
              <Text style={styles.loginText}>Login As Supervisor</Text>
            </View>
          </Link>

          {/* Worker Login Box */}
          <Link href="/WorkerLogin" style={styles.loginBox2}>
            <View style={styles.innerBox}>
              <Text style={styles.loginText}>Login As Worker</Text>
            </View>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Index;

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
    backgroundColor: "rgba(90, 19, 255, 0.94)", // Transparent background
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
    backgroundColor: "rgba(19, 94, 255, 0.94)", // Transparent background
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
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Inner small transparency
    borderRadius: 10,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
