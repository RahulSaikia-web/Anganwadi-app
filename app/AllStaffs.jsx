import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, 
  Image, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result || null;
}

const AllStaffs = () => {
  const [staffsList, setStaffsList] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStaffs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStaffs(); // Refresh the list
  }, []);

  const getStaffs = async () => {
    setIsLoading(true);
    let JWT_Token = await storeGetValueFor('JWT-Token');
    const apiUrl = 'https://magicminute.online/api/v1/staffs/';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_Token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStaffsList(data['data']);
      } else {
        console.log('Failed to fetch Staffs');
      }
    } catch (error) {
      console.error('Error fetching Staffs:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  let imgUrl = 'https://magicminute.online/media/images/staffs/';

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
          <Text style={styles.headingText}>All Staffs</Text>
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#d32f2f" />
          <Text style={styles.loadingText}>Loading staffs...</Text>
        </View>
      ) : (
        <FlatList
          data={staffsList}
          keyExtractor={(item) => item.staff_id ? item.staff_id.toString() : `${item.staff_phone}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <View style={styles.staffCard}>
              {/* Serial Number (Left) */}
              <Text style={styles.serialNumber}>{index + 1}.</Text>

              {/* Staff Info (Image & Details in One Row) */}
              <View style={styles.staffInfo}>
                {/* Staff Image */}
                <Image
                  source={item.staff_image ? { uri: `${imgUrl}${item.staff_image}` } : require('@/assets/images/profile.webp')}
                  style={styles.staffImage}
                />

                {/* Staff Details */}
                <View style={styles.textContainer}>
                  <Text style={styles.staffName}>{item.staff_full_name}</Text>
                  <Text style={styles.details}>📞 {item.staff_phone}</Text>
                  <Text style={styles.details}>🛠 Role: {item.staff_role}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
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
  headingText:{
    fontSize:18,
    color:'#fafafa',
    marginLeft:"10%",
    fontWeight:'bold'
  },
  serialNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginRight: 15,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
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
