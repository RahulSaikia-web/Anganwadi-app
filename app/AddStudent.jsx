import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AddStudent = () => {
  const navigation = useNavigation();
  const apiUrl = 'https://magicminute.online/api';
  const [form, setForm] = useState({
    studentName: '',
    dob: '',
    gender: '',
    motherName: '',
    fatherName: '',
    phoneNumber: '',
    centerId: '',
    photo: null,
  });

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0] });
    }
  };

  const handleCameraCapture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0] });
    }
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((value) => !value)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('student_name', form.studentName);
    formData.append('student_dob', form.dob);
    formData.append('student_gender', form.gender);
    formData.append('student_mother_name', form.motherName);
    formData.append('student_father_name', form.fatherName);
    formData.append('student_phone', form.phoneNumber);
    formData.append('student_center_id', form.centerId);
    
    if (form.photo) {
      formData.append('student_image', {
        uri: form.photo.uri,
        type: 'image/jpeg',
        name: 'student.jpg',
      });
    }

    try {
      const response = await fetch(`${apiUrl}/v1/students`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add student');
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
        <View style={styles.container}>
          <Text style={styles.label}>Student Name *</Text>
          <TextInput style={styles.input} maxLength={30} onChangeText={(value) => handleInputChange('studentName', value)} />

          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" onChangeText={(value) => handleInputChange('dob', value)} />

          <Text style={styles.label}>Gender *</Text>
          <Picker style={styles.picker} selectedValue={form.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>

          <Text style={styles.label}>Mother Name *</Text>
          <TextInput style={styles.input} onChangeText={(value) => handleInputChange('motherName', value)} />

          <Text style={styles.label}>Father Name *</Text>
          <TextInput style={styles.input} onChangeText={(value) => handleInputChange('fatherName', value)} />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput style={styles.input} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('phoneNumber', value)} />

          <Text style={styles.label}>Center ID *</Text>
          <TextInput style={styles.input} onChangeText={(value) => handleInputChange('centerId', value)} />

          <Text style={styles.label}>Photo *</Text>
          <View style={styles.buttonContainer}>
            <Button title="Pick Photo" onPress={handleImagePick} />
            <View style={styles.buttonSpacing} />
            <Button title="Take Photo" onPress={handleCameraCapture} />
          </View>
          {form.photo && <Image source={{ uri: form.photo.uri }} style={styles.image} />}

          <View style={styles.buttonSpacing} />
          <Button title="Submit" onPress={handleSubmit} color="#28a745" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    height: 10,
  },
});

export default AddStudent;
