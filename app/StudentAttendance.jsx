import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, 
  Alert, Image, ActivityIndicator, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result || null;
}

const StudentAttendance = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
    const today = getCurrentDate();
    if (storedDate !== today) {
      await AsyncStorage.setItem('attendanceDate', today);
      setAttendanceData({});
    }
  };

  const getStudents = async () => {
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
        Alert.alert('Error', 'Failed to fetch students');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection.');
    }
  };

  const verifyAttendance = async (studentId, uri) => {
    setModalVisible(true);
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await FileSystem.uploadAsync(
        `https://magicminute.online/api/v1/attendance/students/${studentId}`, uri, {
          fieldName: 'image_file',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: { Authorization: `Bearer ${JWT_Token}`, Accept: 'application/json' },
        }
      );
      setModalVisible(false);
      if (response.status === 200) {
        Alert.alert('Success', 'Student Verified successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        let resData = await JSON.parse(response.body);
        Alert.alert('Error', resData.detail);
      }
    } catch (error) {
      setModalVisible(false);
      Alert.alert('Error', 'Verification failed, please try again.');
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
    let loaded_image_uri = await loadImage();
    if (loaded_image_uri) {
      await verifyAttendance(studentId, loaded_image_uri);
    }
  };

  let imgUrl = 'https://magicminute.online/media/images/students/';

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.modalText}>Verifying Face ID</Text>
        </View>
      </Modal>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={studentsList}
        keyExtractor={(item) => item.student_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <View style={styles.studentCard}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            <Image source={{ uri: `${imgUrl}${item.student_image}` }} style={styles.studentImage} />
            <View>
              <Text style={styles.details}>👩‍🎓 {item.student_full_name}</Text>
              <Text style={styles.details}>📞 {item.student_phone}</Text>
              <Text>Status: {getCurrentDate() === item.student_last_attendance ? 'Present' : 'Absent'}</Text>
              {getCurrentDate() !== item.student_last_attendance && (
                <TouchableOpacity style={styles.submitButton} onPress={() => submitAttendance(item.student_id)}>
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalText: { color: 'white', marginTop: 10 },
  navBar: { width: '100%', height: 60, backgroundColor: 'darkred', justifyContent: 'center', paddingHorizontal: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 5 },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 8 },
  studentImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  submitButton: { backgroundColor: '#45d189', padding: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default StudentAttendance;