import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const FormData = global.FormData;
  
const AddStudent = () => {
  const [image, setImage] = useState();
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

  const loadImage = async (mode) => {
    try{
      let result = {};
      if (mode == 'gallery'){
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaType: ['image'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true
        });
      }else{
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [1, 1],
          base64: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0]);
      }
    } catch (error){
      alert("Error loading image: " + error);
    }
  }

  const saveImage = async (image) => {
    try {
      setImage(image);
    } catch (error){
      throw error;
    }
  }

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
   
    try {
      if (image){
        formData.append('student_image_file', image.base64);
      }
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: apiUrl+'/v1/students',
          headers: {
            'Authorization' : 'Bearer' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwianRpIjoiYzBmYWUxNjctM2VkMy00NDk5LWFmN2QtMDQ1ZjdiYTcyZTVjIiwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZSwiY3NyZiI6IiIsImlhdCI6MTc0MTM3ODgzOSwiZXhwIjoxNzQxNDE0ODM5LjIxNTgsInVzZXJfdHlwZSI6InN0YWZmIiwidXNlcl9pZCI6MiwidXNlcl9yb2xlIjoiV29ya2VyIn0.ScEZsQ1AYqpYikmClY4CkENr1CLLAlH6_kN0FP6CLEXmsh1RHoQUsN7o3_OcUFDYQRLg0Rg64HsXacgp2oe_4j88_gWT4ciFp-lpaq3kNQKgqkH9xQTIbErQX1eD4pU_m3fJh4SCZF6-zD3nVmeWgMZRUWgKMwqkhvHeYtVn9mzPtBexca651xDjm44pUjilyrYfgbAbd1iveD5qgLx9IlWt2rALjNLLYhMOa6-1A2rjuGhAIhO0K6jS4I1TipxoujhYaNg_BRQUvjo7P9ZEGqPZM-KWmMitVStxO5-4kgawnw31zxwtWMKDiNHqB3ZfkgBBkhDIijAmr7NRWpfFmw',
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        };
  
        axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          Alert.alert('Success', 'Student added successfully!');
        })
        .catch((error) => {
          Alert.alert('Error', 'Failed to add student nowwww!');
          console.log(error.response.data);
        });

    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to add student here');
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
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
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
        <Button title="Pick Photo" onPress={() => { loadImage('gallery')}} />
        <View style={styles.buttonSpacing} />
        <Button title="Take Photo" onPress={() => { loadImage()}} />
      </View>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      
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
