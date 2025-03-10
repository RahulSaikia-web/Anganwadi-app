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


const AllStaffs = () => {
  const [staffsList, setStaffsList] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500); 
  }, []);

    useEffect(()=>{
      getStaffs()
    },[])
  
    const getStaffs = async ()=>{
      let JWT_Token = await storeGetValueFor('JWT-Token');

         const apiUrl = 'https://magicminute.online/api/v1/staffs/';
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
            setStaffsList(data['data']);
          } else {
            console.log(response)
            console.log('Failed to fetch Staffs');
          }
        } catch (error) {
          console.error('Error fetching Staffs:', error);
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
        data={staffsList}
        keyExtractor={(item) => item.id ? item.staff_id.toString() : `${item.staff_phone}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <View style={styles.staffCard}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            <View>
              <Text style={styles.details}>👩‍👦 Name : {item.staff_full_name}</Text>
              <Text style={styles.details}>📞Phone : {item.staff_phone}</Text>
              <Text style={styles.details}> Role : {item.staff_role}</Text>
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
  staffCard: {
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

export default AllStaffs;
