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

const SelfAttendance = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const [staffList, setstaffList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false);
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
    }
  };

  const getStudents = async () => {
    setLoading(true); // Start loading
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
        setstaffList(data['data']);
      } else {
        Alert.alert('Error', 'Failed to fetch students');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const verifyAttendance = async (staff_id, uri) => {
    setModalVisible(true);
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await FileSystem.uploadAsync(
        `https://magicminute.online/api/v1/attendance/staffs/${staff_id}`, uri, {
          fieldName: 'image_file',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: { Authorization: `Bearer ${JWT_Token}`, Accept: 'application/json' },
        }
      );
      setModalVisible(false);
      if (response.status === 200) {
        Alert.alert('Success', 'Staff Verified successfully!', [
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

  const submitAttendance = async (staff_id) => {
    let loaded_image_uri = await loadImage();
    if (loaded_image_uri) {
      await verifyAttendance(staff_id, loaded_image_uri);
    }
  };
  
  let imgUrl = 'https://magicminute.online/media/images/staffs/';

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>

          <ActivityIndicator size="large" color="white" />
          <Text style={styles.modalText}>Verifying Face ID...</Text>
        </View>
      </Modal>
      
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
          <Text style={styles.headingText}>Staff Attendence</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="darkred" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={staffList}
          keyExtractor={(item) => item.staff_id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <View style={styles.studentCard}>
              <Text style={styles.serialNumber}>{index + 1}.</Text>
              <Image source={{ uri: `${imgUrl}${item.staff_image}` }} style={styles.studentImage} />
              <View style={styles.detailsContainer}>
                <Text style={styles.studentName}>👩‍🎓 {item.staff_full_name}</Text>
                <Text style={styles.studentDetails}>📞 {item.staff_phone}</Text>
                <Text style={styles.studentDetails}>
                  <Text style={styles.statusLabel}>Status: </Text> 
                  {getCurrentDate() === item.staff_last_attendance ? (
                    <Text style={styles.present}>Present</Text>
                  ) : (
                    <Text style={styles.absent}>Absent</Text>
                  )}
                </Text>
                {getCurrentDate() !== item.staff_last_attendance && (
                  <TouchableOpacity style={styles.submitButton} onPress={() => submitAttendance(item.staff_id)}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
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

export default SelfAttendance;
