import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get JWT Token securely
async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result || null;
}

const StudentAttendance = () => {
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

  // Capture photo for attendance
  const takePhoto = async (studentId) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take attendance photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttendanceData((prevData) => ({
        ...prevData,
        [studentId]: { image: result.assets[0].uri, status: 'Submit' },
      }));
    }
  };

  // Get current date
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // Submit attendance
  const submitAttendance = async (studentId) => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    if (!JWT_Token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    const apiUrl = 'https://magicminute.online/api/v1/attendance/submit';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_Token}`,
        },
        body: JSON.stringify({
          student_id: studentId,
          status: 'Present', // Adjust as needed
        }),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        setAttendanceData((prevData) => ({
          ...prevData,
          [studentId]: { ...prevData[studentId], status: 'Present' },
        }));
        Alert.alert('Success', 'Attendance submitted successfully!');
      } else {
        Alert.alert('Error', responseData.message || 'Failed to submit attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      Alert.alert('Network Error', 'Please check your internet connection.');
    }
  };

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

                {studentStatus === 'Attendance' ? (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={() => takePhoto(item.student_id)}
                  >
                    <Text style={styles.buttonText}>Take Photo</Text>
                  </TouchableOpacity>
                ) : studentStatus === 'Submit' ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => submitAttendance(item.student_id)}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                ) : (
                  <Text>Status: <Text style={styles.status}>{studentStatus}</Text></Text>
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
    backgroundColor: 'orange',
    margin: 10,
    padding: 10,
    width: 100,
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
