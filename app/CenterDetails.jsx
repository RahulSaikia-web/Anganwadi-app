import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}

const CenterDetails = () => {
  const navigation = useNavigation();
  const [Centerdata, setCenterData] = useState();

   useEffect(()=>{
        getStudents()
      },[])
    
      const getStudents = async ()=>{
        let JWT_Token = await storeGetValueFor('JWT-Token');
  
           const apiUrl = 'https://magicminute.online/api/v1/anganwadi/';
          try {
            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_Token}`, // Add the token here
              },
            });
      
            if (response.ok) {
              const data = await response.json();
              // console.log(data);
              
              setCenterData(data);              
            } else {
              console.log('Failed to fetch Center');
            }
          } catch (error) {
            console.error('Error fetching Center:', error);
          }
        }


  return (
    
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      {Centerdata && 
 <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Center Code:</Text>
          <Text style={styles.value}>{Centerdata.center_code}</Text>

          <Text style={styles.label}>Center Name:</Text>
          <Text style={styles.value}>{Centerdata.center_name}</Text>

          <Text style={styles.label}>Address :</Text>
          <Text style={styles.value}>{Centerdata.center_address}</Text>
        </View>
      </View> 

      }
         
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "darkred",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "darkred",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
});

export default CenterDetails;
