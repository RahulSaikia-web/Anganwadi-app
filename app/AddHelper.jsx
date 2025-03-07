import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddHelper = () => {
  const navigation = useNavigation();
  const [helper, setHelper] = useState({ name: '', address: '', phone: '', aadhar: '', image: null });
  const [refreshing, setRefreshing] = useState(false);

  // Function to reset form
  const resetForm = () => {
    setHelper({ name: '', address: '', phone: '', aadhar: '', image: null });
  };

  // Function to pick an image from the device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setHelper({ ...helper, image: result.assets[0].uri });
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!helper.name || !helper.address || !helper.phone || !helper.aadhar || !helper.image) {
      Alert.alert("All fields required", "Please fill in all details before submitting.");
      return;
    }

    console.log('Helper Data:', helper);

    // Placeholder fetch request (Replace with actual API endpoint)
    /*
    try {
      const formData = new FormData();
      formData.append('name', helper.name);
      formData.append('address', helper.address);
      formData.append('phone', helper.phone);
      formData.append('aadhar', helper.aadhar);
      formData.append('image', {
        uri: helper.image,
        name: 'helper_photo.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Server Response:', data);
      Alert.alert("Success", "Helper added successfully!");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    */
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    resetForm();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Navbar with back button */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.formContainer} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={styles.label}>Helper Name</Text>
        <TextInput style={styles.input} placeholder="Enter Helper Name" value={helper.name} onChangeText={(text) => setHelper({ ...helper, name: text })} />
        
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Enter Address" value={helper.address} onChangeText={(text) => setHelper({ ...helper, address: text })} />
        
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} placeholder="Enter Phone Number" keyboardType="numeric" value={helper.phone} onChangeText={(text) => setHelper({ ...helper, phone: text })} />
        
        <Text style={styles.label}>Aadhar</Text>
        <TextInput style={styles.input} placeholder="Enter Aadhar Number" keyboardType="numeric" value={helper.aadhar} onChangeText={(text) => setHelper({ ...helper, aadhar: text })} />
        
        {/* Upload Image Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadText}>Upload Picture</Text>
        </TouchableOpacity>
        {helper.image && <Image source={{ uri: helper.image }} style={styles.imagePreview} />}
        
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  navbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B0000', padding: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 10 },
  formContainer: { padding: 20, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, alignSelf: 'flex-start' },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginTop: 5, elevation: 2, width: '100%' },
  uploadButton: { backgroundColor: 'blue', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15, width: '100%' },
  uploadText: { color: 'white', fontSize: 16 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, alignSelf: 'center', marginTop: 10 },
  submitButton: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, width: '100%' },
  submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AddHelper;