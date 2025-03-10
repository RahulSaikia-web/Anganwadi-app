import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, 
  Alert, Image, ActivityIndicator, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result || null;
}

const StudentAttendance = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getStudents();
    checkAttendanceDate();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStudents();
    setRefreshing(false);
  }, []);

  const checkAttendanceDate = async () => {
    const storedDate = await AsyncStorage.getItem('attendanceDate');
    const today = new Date().toLocaleDateString();
    if (storedDate !== today) {
      await AsyncStorage.setItem('attendanceDate', today);
    }
  };

  const getStudents = async () => {
    setLoading(true);
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
        setStudentsList(data['data'].reverse());
      } else {
        Alert.alert('Error', 'Failed to fetch students');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.5 });
    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  const submitAttendance = async (studentId) => {
    setIsProcessing(true); // Show modal
    let loaded_image_uri = await loadImage();

    if (!loaded_image_uri) {
      setIsProcessing(false);
      Alert.alert('Error', 'No image selected.');
      return;
    }

    let JWT_Token = await storeGetValueFor('JWT-Token');
    const apiUrl = `https://magicminute.online/api/v1/verify_face/`;

    let formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('image', {
      uri: loaded_image_uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JWT_Token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      setIsProcessing(false); // Hide modal

      if (response.ok) {
        if (result.status === 'success') {
          Alert.alert('Verification Successful', 'Attendance has been marked!');
          await getStudents();
        } else {
          Alert.alert('Verification Failed', result.error || 'Unknown error. Please try again.');
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to verify face. Please try again.');
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Network Error', 'Please check your internet connection.');
    }
  };

  let imgUrl = 'https://magicminute.online/media/images/students/';

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
          <Text style={styles.headingText}>Students Attendance</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.date}>Today Date : {currentDateTime.toLocaleString()}</Text>

      {/* Loading Modal */}
      <Modal visible={isProcessing} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="darkred" />
            <Text style={styles.modalText}>Processing...</Text>
          </View>
        </View>
      </Modal>

      {/* Student List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="darkred" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={studentsList}
          keyExtractor={(item) => item.student_id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => {
            const lastAttendanceDate = new Date(item.student_last_attendance).toLocaleDateString();
            const todayDate = new Date().toLocaleDateString();
            const isPresent = lastAttendanceDate === todayDate;

            return (
              <View style={styles.studentCard}>
                <Text style={styles.serialNumber}>{index + 1}.</Text>
                <Image source={{ uri: `${imgUrl}${item.student_image}` }} style={styles.studentImage} />
                <View style={styles.detailsContainer}>
                  <Text style={styles.studentName}>👩‍🎓 {item.student_full_name}</Text>
                  <Text style={styles.studentDetails}>📞 {item.student_phone}</Text>
                  <Text style={styles.studentDetails}>
                    <Text style={styles.statusLabel}>Status: </Text> 
                    {isPresent ? (
                      <Text style={styles.present}>Present</Text>
                    ) : (
                      <Text style={styles.absent}>Absent</Text>
                    )}
                  </Text>

                  {!isPresent && (
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitAttendance(item.student_id)}>
                      <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalText: { color: 'white', marginTop: 10, fontSize: 16 },
  navBar: { width: '100%', height: 60, backgroundColor: 'darkred', justifyContent: 'center', paddingHorizontal: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  date:{color:"green", fontSize:16,marginLeft:"20%",marginTop:30,fontWeight:"bold"},
  loadingText: { marginTop: 10, fontSize: 16, color: 'darkred' },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 8 },
  serialNumber: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  studentImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  detailsContainer: { flex: 1 },
  studentName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  studentDetails: { fontSize: 16, color: '#555', marginBottom: 5 },
  present: { color: 'green', fontWeight: 'bold' },
  absent: { color: 'red', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5, width: 120 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  headingText:{
    fontSize:18,
    color:'#fafafa',
    marginLeft:"10%",
    fontWeight:'bold'
  },
});

export default StudentAttendance;
