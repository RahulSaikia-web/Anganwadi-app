import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}


const AllStudent = () => {
  const [studensList, setStudensList] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500); 
  }, []);

    useEffect(()=>{
      getStudents()
    },[])
  
    const getStudents = async ()=>{
      let JWT_Token = await storeGetValueFor('JWT-Token');

         const apiUrl = 'https://magicminute.online/api/v1/students/';
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
            setStudensList(data['data']);
            console.log(studensList);
            
          } else {
            console.log('Failed to fetch students');
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    

    

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={studensList}
        keyExtractor={(item) => item.id ? item.student_id.toString() : `${item.student_full_name}-${item.student_phone}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <View style={styles.studentCard}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            <View>
              <Text style={styles.details}>👩‍👦 Student : {item.student_full_name}</Text>
              <Text style={styles.details}>📞Phone : {item.student_phone}</Text>
              <Text style={styles.details}>👩‍👦 Mother: {item.student_mother_name}</Text>
              <Text style={styles.details}>👨‍👦 Father: {item.student_father_name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    width: '100%',
    height: 60,
    backgroundColor: 'darkred',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#d32f2f',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default AllStudent;
