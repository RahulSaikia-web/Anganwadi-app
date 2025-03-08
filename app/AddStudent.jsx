import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import {DateTimePicker, DateTimePickerAndroid} from '@react-native-community/datetimepicker';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}

const AddStudent = () => {
  const navigation = useNavigation();  // Initialize navigation hook
  const [image, setImage] = useState();
  const [imageId, setImageId] = useState();
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    
    saveDate(currentDate);
  };

  const saveDate = (currentDate) => {
    setForm({ ...form, 'student_dob': currentDate.toLocaleDateString('en-CA') });
  }

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const apiUrl = 'https://magicminute.online/api';
  const [form, setForm] = useState({
    student_full_name: '',
    student_dob: '',
    student_gender: '',
    student_mother_name: '',
    student_father_name: '',
    student_phone: '',
    student_aadhar: '',
    student_center_id: 1,
    student_image: '',
  });

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const loadImage = async (mode) => {
    try {
      let result = {};
      if (mode == 'gallery') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaType: ['image'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri)
        await saveImage(result.assets[0]);
      }
    } catch (error) {
      alert('Error loading image: ' + error);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image)
    } catch (error) {
      throw error;
    }
  };


  const uploadImage = async (uri) =>{
    console.log("Upload start")
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await FileSystem.uploadAsync(apiUrl+ '/v1/images/students/', uri, {
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
        setForm({ ...form, "student_image": JSON.parse(response.body)});
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    if (Object.values(form).some((value) => !value)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if ( form.student_full_name.length < 5 || form.student_mother_name.length < 5 || form.student_father_name.length < 5)
    {
      Alert.alert('Error', 'All Names must be greater than 5 char!');
      return;
    }

    if ( form.student_phone.length != 10)
    {
      Alert.alert('Error', 'Invalid phone');
      return;
    }

    if ( form.student_aadhar.length != 12)
    {
      Alert.alert('Error', 'Invalid Aadhar');
      return;
    }

    
    try {

        let JWT_Token = await storeGetValueFor('JWT-Token');
        let config = {
          method: 'post',
          url: apiUrl + '/v1/students/',
          headers: {
            Authorization: 'Bearer ' + JWT_Token,
            'Content-Type': 'application/json',
          },
          data: form,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            Alert.alert('Success', 'Student added successfully!');
          })
          .catch((error) => {
            Alert.alert('Error', 'Failed to add student nowww!');
            console.log(error.response.data);
          });

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add student here');
    }
  };

  return (
    <ScrollView>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>

      
      <Text style={styles.label}>
          Photo <Text style={styles.required}>*</Text>
        </Text>
      <View style={styles.buttonContainer}>
          <Button title="Pick Photo" onPress={() => loadImage('gallery')} />
          <View style={styles.buttonSpacing} />
          <Button title="Take Photo" onPress={() => loadImage()} />
        </View>
        {image && <Image source={{ uri: image.uri }} style={styles.image} />}

        <Text style={styles.label}>
        </Text>
        <Text style={styles.label}>
          Student Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} maxLength={30} onChangeText={(value) => handleInputChange('student_full_name', value)} />

        <Text style={styles.label}>
          Date of birth <Text style={styles.required}>*</Text>
        </Text>
        <SafeAreaView>
            <TouchableOpacity onPress={showDatepicker} style={styles.input} >
            <Text > {form.student_dob? form.student_dob: "YYYY-MM-DD" } </Text>
          </TouchableOpacity>
        </SafeAreaView>

        <Text style={styles.label}>
          Gender <Text style={styles.required}>*</Text>
        </Text>
        <Picker style={styles.picker} selectedValue={form.gender} onValueChange={(value) => handleInputChange('student_gender', value)}>
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <Text style={styles.label}>
          Mother Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('student_mother_name', value)} />

        <Text style={styles.label}>
          Father Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('student_father_name', value)} />

        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('student_phone', value)} />

        <Text style={styles.label}>
          Aadhar Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} buttonStyle={{ justifyContent: 'flex-end' }} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('student_aadhar', value)} />

        <View style={styles.buttonSpacing} />
        <Button title="Submit" onPress={handleSubmit} color="#28a745" />
      </View>
    </ScrollView>
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
  dateInput: {
    
  },
  input1: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  navbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'darkred', padding: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 5 },
  navTitle: { fontSize: 20, color: 'darkred', fontWeight: 'bold', marginLeft: 15 },
});

export default AddStudent;
