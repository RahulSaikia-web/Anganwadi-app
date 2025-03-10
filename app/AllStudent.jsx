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

const AllStudent = () => {
  const [studentsList, setStudentsList] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loader state

  useEffect(() => {
    getStudents();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStudents(); // Refresh the list
  }, []);

  const getStudents = async () => {
    setIsLoading(true); // Show loader while fetching
    let JWT_Token = await storeGetValueFor('JWT-Token');
    const apiUrl = 'https://magicminute.online/api/v1/students/';

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
        setStudentsList(data['data']);
      } else {
        console.log('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false); // Hide loader after fetching
      setRefreshing(false);
    }
  };

  let imgUrl = 'https://magicminute.online/media/images/students/';

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#d32f2f" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : (
        <FlatList
          data={studentsList}
          keyExtractor={(item) => item.student_id ? item.student_id.toString() : `${item.student_phone}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <View style={styles.studentCard}>
              {/* Serial Number (Left) */}
              <Text style={styles.serialNumber}>{index + 1}.</Text>

              {/* Student Info (Image & Details in One Row) */}
              <View style={styles.studentInfo}>
                {/* Student Image (Left of Text) */}
                <Image
                  source={item.student_image ? { uri: `${imgUrl}${item.student_image}` } : require('@/assets/images/profile.webp')}
                  style={styles.studentImage}
                />

                {/* Student Details (Right of Image) */}
                <View style={styles.textContainer}>
                  <Text style={styles.studentName}>{item.student_full_name}</Text>
                  <Text style={styles.details}>📞 {item.student_phone}</Text>
                  <Text style={styles.details}>👩‍👦 Mother: {item.student_mother_name}</Text>
                  <Text style={styles.details}>👨‍👦 Father: {item.student_father_name}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginRight: 15,
  },
  studentInfo: {
    flexDirection: 'row', // Aligns image & text horizontally
    alignItems: 'center', // Keeps them centered in the row
    flex: 1,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it a perfect circle
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Makes sure text fills remaining space
  },
  studentName: {
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

export default AllStudent;
