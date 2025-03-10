import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get JWT Token securely
async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result || null;
}

const StudentAttendance = () => {
  // Get current date
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  console.log(getCurrentDate())

  const [studentsList, setStudentsList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch students when component mounts
  useEffect(() => {
    getStudents();
    checkAttendanceDate();
  }, []);

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getStudents();
      setRefreshing(false);
    }, 1500);
  }, []);

  // Check and reset attendance if the date has changed
  const checkAttendanceDate = async () => {
    const storedDate = await AsyncStorage.getItem('attendanceDate');
    const today = getCurrentDate();

    if (storedDate !== today) {
      await AsyncStorage.setItem('attendanceDate', today);
      setAttendanceData({});
    }
  };

  // Get students from API
  const getStudents = async () => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    if (!JWT_Token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

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
        Alert.alert('Error', 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Network Error', 'Please check your internet connection.');
    }
  };

  const verifyAttendance = async (studentId, uri) =>{

    console.log("Processing face ID")
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await FileSystem.uploadAsync('https://magicminute.online/api/v1/attendance/students/'+studentId, uri, {
        fieldName: 'image_file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers : {
          Authorization: 'Bearer ' + JWT_Token,
          Accept: 'application/json',
        }
      });
      if (response.status === 200)
      {
        Alert.alert('Success', 'Student Verified successfully!', [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
      else if (response.status >= 400)
      {
        let resData = await JSON.parse(response.body);

        Alert.alert('Error', resData.detail, [
          { text: "Try Again!"}
        ]);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const loadImage = async () => {
    try {
     
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: .5,
      });
    
      if (!result.canceled) {
        return result.assets[0].uri
      }
    } catch (error) {
      alert('Error loading image: ' + error);
    }
  };

  const submitAttendance = async (studentId) => {
    console.log("Start verification")

    let loaded_image_uri = await loadImage();
    if (!loaded_image_uri)
    {
      console.log("Image not loaded")
      return
    }
    await verifyAttendance(studentId, loaded_image_uri);
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

      {/* Student List */}
      <FlatList
        data={studentsList}
        keyExtractor={(item) => item.student_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const studentStatus = attendanceData[item.student_id]?.status || 'Attendance';

          return (
            <View style={styles.studentCard}>
              <Text style={styles.serialNumber}>{index + 1}.</Text>
              <View>
                <Text style={styles.details}>👩‍👦 Student: {item.student_full_name}</Text>
                <Text style={styles.details}>📞 Phone: {item.student_phone}</Text>
                <Text style={styles.details}>👩‍👦 Mother: {item.student_mother_name}</Text>
                <Text style={styles.details}>👨‍👦 Father: {item.student_father_name}</Text>
                <Text style={styles.dateText}>📅 Today: {getCurrentDate()}</Text>

                {getCurrentDate() === item.student_last_attendance ? (
                  <>
                    <Text>Status: Present</Text>
                  </>
                ) : (
                  <>
                    <Text>Status: Absent</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitAttendance(item.student_id)}>
                      <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                  </>
                )}

              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  captureButton: {
    backgroundColor: 'lightgreen',
    margin: 10,
    padding: 10,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#45d189',
    margin: 10,
    padding: 10,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  status: {
    color: 'darkgreen',
    fontWeight: 'bold',
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
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default StudentAttendance;
