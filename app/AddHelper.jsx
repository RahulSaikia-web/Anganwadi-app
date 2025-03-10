import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView, TouchableOpacity , ActivityIndicator,Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation,  } from '@react-navigation/native';  // Import useNavigation
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';


async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}

const AddHelper = () => {

  const navigation = useNavigation();  // Initialize navigation hook
  const [image, setImage] = useState();
  const [uploadingForm , setuploadingForm] = useState(false)

  const apiUrl = 'https://magicminute.online/api';
  const [form, setForm] = useState({
    staff_full_name: '',
    staff_phone: '',
    staff_aadhar: '',
    staff_role: 'Helper',
    staff_center_id: 99,
    staff_image: '',
    staff_mpin: '00000',
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
          quality: .5,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [1, 1],
          quality: .5,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0]);
        await uploadImage(result.assets[0].uri)
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
    // setForm({ ...form, "student_image": ''});
    console.log("Upload start")
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await FileSystem.uploadAsync(apiUrl+ '/v1/images/staffs/', uri, {
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
        console.log("response")
        console.log(response.body)
        setForm({ ...form, "staff_image": JSON.parse(response.body)});
      }

    } catch (error) {
      console.log(error);
    }
    console.log("upload finish")
  }


  const handleSubmit = async () => {
    setuploadingForm(true); // Show loading modal
  
    if (Object.values(form).some((value) => !value)) {
      setuploadingForm(false);
      Alert.alert('Error', 'All fields are required', [{ text: "OK", onPress: () => setuploadingForm(false) }]);
      return;
    }
  
    if (form.staff_full_name.length < 5) {
      setuploadingForm(false);
      Alert.alert('Error', 'Names must be greater than 5 char!', [{ text: "OK", onPress: () => setuploadingForm(false) }]);
      return;
    }
  
    if (form.staff_phone.length !== 10) {
      setuploadingForm(false);
      Alert.alert('Error', 'Invalid phone', [{ text: "OK", onPress: () => setuploadingForm(false) }]);
      return;
    }
  
    if (form.staff_aadhar.length !== 12) {
      setuploadingForm(false);
      Alert.alert('Error', 'Invalid Aadhar', [{ text: "OK", onPress: () => setuploadingForm(false) }]);
      return;
    }
  
    try {
      let JWT_Token = await storeGetValueFor('JWT-Token');
      let config = {
        method: 'post',
        url: apiUrl + '/v1/staffs/',
        headers: {
          Authorization: 'Bearer ' + JWT_Token,
          'Content-Type': 'application/json',
        },
        data: form,
      };
  
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
  
      Alert.alert('Success', 'Helper added successfully!', [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
  
    } catch (error) {
      console.log(error.response?.data || error);
  
      Alert.alert('Error', 'Failed to add Helper!', [
        { text: "OK", onPress: () => setuploadingForm(false) }
      ]);
    }
  };
  

  return (
    <ScrollView>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
          <Text style={styles.headingText}>Add Students</Text>
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
          Helper Full Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} maxLength={30} onChangeText={(value) => handleInputChange('staff_full_name', value)} />

        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('staff_phone', value)} />

        <Text style={styles.label}>
          Aadhar Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} buttonStyle={{ justifyContent: 'flex-end' }} keyboardType="phone-pad" onChangeText={(value) => handleInputChange('staff_aadhar', value)} />

        <View style={styles.buttonSpacing} />
        <Button title="Submit" onPress={handleSubmit} color="#28a745" />
        <Modal animationType="fade" transparent={true} statusBarTranslucent={true} visible={uploadingForm}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <ActivityIndicator size="large" color={'red'} />
            <Text> Generating Face ID</Text>
            </View>
            </View>
            </Modal>
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

 border: {
    borderRadius:10
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
 headingText:{
  fontSize:18,
  color:'#fafafa',
  marginLeft:"25%",
  fontWeight:'bold'
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
  centeredView: {
    flex: 1,
    justifyContent: "center", alignItems: "center", backgroundColor: '#0008'
    },
    
    
    modalView: {
    margin: 20,
    width: 200,
    height: 70,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    },
    
    
    shadowOffset: { 
    width: 0,
    height: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    },
    modalText: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 17,
    marginLeft: 15,
    }
});

export default AddHelper;
