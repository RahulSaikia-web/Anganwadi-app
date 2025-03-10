import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';

const AddStaff = () => {
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);

  const [staffData, setStaffData] = useState({
    name: '',
    phone: '',
    role: '',
    aadhar: '',
    centerId: '',
    image: null,
    password: '',
  });

  // Function to open Camera
  const openCamera = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, (response) => {
      if (!response.didCancel && response.assets) {
        setStaffData({ ...staffData, image: response.assets[0].uri });
      }
    });
  };

  // Function to open Gallery
  const openGallery = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && response.assets) {
        setStaffData({ ...staffData, image: response.assets[0].uri });
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="darkred" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
        {/* Image Upload */}
        <TouchableOpacity
          style={styles.imageUpload}
          onPress={() => actionSheetRef.current.show()}
        >
          {staffData.image ? (
            <Image source={{ uri: staffData.image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageUploadText}>Upload Staff Image</Text>
          )}
        </TouchableOpacity>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name of Staff"
          value={staffData.name}
          onChangeText={(text) => setStaffData({ ...staffData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={staffData.phone}
          onChangeText={(text) => setStaffData({ ...staffData, phone: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Role of Staff"
          value={staffData.role}
          onChangeText={(text) => setStaffData({ ...staffData, role: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Aadhar Number"
          keyboardType="numeric"
          value={staffData.aadhar}
          onChangeText={(text) => setStaffData({ ...staffData, aadhar: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Center ID"
          value={staffData.centerId}
          onChangeText={(text) => setStaffData({ ...staffData, centerId: text })}
        />


        {/* Action Sheet for Camera or Gallery */}
        <ActionSheet
          ref={actionSheetRef}
          title="Select Image Source"
          options={['Take a Photo', 'Choose from Gallery', 'Cancel']}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index === 0) openCamera();
            else if (index === 1) openGallery();
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Password / MPIN"
          secureTextEntry
          value={staffData.password}
          onChangeText={(text) => setStaffData({ ...staffData, password: text })}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Add Staff</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    color: 'darkred',
    marginLeft: 5,
  },
  form: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  imageUpload: {
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageUploadText: {
    color: '#ffffff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStaff;
