import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const StudentAttendance = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take attendance photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitAttendance = async () => {
    if (!image) {
      alert('Please take a photo first');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'attendance.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch('API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      alert(result.message || 'Attendance submitted successfully');
    } catch (error) {
      alert('Failed to submit attendance');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Instructions Section - Moved to the Top */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How It Works:</Text>
          <Text style={styles.instruction}>• Tap "📸 Capture Attendance" to take a photo.</Text>
          <Text style={styles.instruction}>• Ensure your face is clearly visible in the photo.</Text>
          <Text style={styles.instruction}>• Tap "Submit" to mark your attendance.</Text>
          <Text style={styles.instruction}>• Wait for a confirmation message.</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <Text style={styles.title}>Student Attendance</Text>

          {/* Image Preview */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>Click Capture Attendance Button</Text>
            )}
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>📸 Capture Attendance</Text>
          </TouchableOpacity>

          {image && (
            <TouchableOpacity style={styles.submitButton} onPress={submitAttendance}>
              <Text style={styles.buttonText}>✅ Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
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
  instructionsContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'black',
  },
  captureButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 350,
    height: 300,
    borderWidth: 2,
    borderColor: '#ced4da',
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default StudentAttendance;
