import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, PermissionsAndroid, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

const AddStudent = () => {
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

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (!response.didCancel && !response.error && response.assets.length > 0) {
        setForm({ ...form, photo: response.assets[0] });
      }
    });
  };

  const handleCameraCapture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo');
      return;
    }
    ImagePicker.launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
      if (!response.didCancel && !response.error && response.assets.length > 0) {
        setForm({ ...form, photo: response.assets[0] });
      }
    });
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
        type: form.photo.type,
        name: form.photo.fileName,
      });
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+access_token )
      const response = await fetch(apiUrl+'/v1/students', {
        method: 'POST',
        headers: myHeaders,
        body: formData,
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
    <View style={styles.container}>
      <Text style={styles.label}>Student Name <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} maxLength={30} onChangeText={(value) => handleInputChange('studentName', value)} />
      
      <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" onChangeText={(value) => handleInputChange('dob', value)} />
      
      <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
      <Picker style={styles.picker} selectedValue={form.gender} onValueChange={(value) => handleInputChange('gender', value)}>
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      
      <Text style={styles.label}>Mother Name <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} onChangeText={(value) => handleInputChange('motherName', value)} />
      
      <Text style={styles.label}>Father Name <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} onChangeText={(value) => handleInputChange('fatherName', value)} />
      
      <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('phoneNumber', value)} />
      
      <Text style={styles.label}>Center ID <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} onChangeText={(value) => handleInputChange('centerId', value)} />
      
      <Text style={styles.label}>Photo <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonContainer}>
        <Button title="Pick Photo" onPress={handleImagePick} />
        <View style={styles.buttonSpacing} />
        <Button title="Take Photo" onPress={handleCameraCapture} />
      </View>
      {form.photo && <Image source={{ uri: form.photo.uri }} style={styles.image} />}
      
      <View style={styles.buttonSpacing} />
      <Button title="Submit" onPress={handleSubmit} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  required: {
    color: 'red',
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
