import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AddBeneficiaries = () => {
  const navigation = useNavigation();
  const [beneficiary, setBeneficiary] = useState({
    name: '',
    address: '',
    husbandName: '',
    phone: '',
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!beneficiary.name || !beneficiary.address || !beneficiary.husbandName || !beneficiary.phone) {
      Alert.alert("All fields required", "Please fill in all details before submitting.");
      return;
    }

    console.log('Beneficiary Data:', beneficiary);

    // Placeholder fetch request (Replace with actual API endpoint)
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beneficiary),
      });
      
      const data = await response.json();
      console.log('Server Response:', data);
      Alert.alert("Success", "Beneficiary added successfully!");
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    */
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
      
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} placeholder="Enter Name" value={beneficiary.name} onChangeText={(text) => setBeneficiary({ ...beneficiary, name: text })} />
        
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Enter Address" value={beneficiary.address} onChangeText={(text) => setBeneficiary({ ...beneficiary, address: text })} />
        
        <Text style={styles.label}>Husband Name</Text>
        <TextInput style={styles.input} placeholder="Enter Husband Name" value={beneficiary.husbandName} onChangeText={(text) => setBeneficiary({ ...beneficiary, husbandName: text })} />
        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="Enter Phone Number" keyboardType="numeric" value={beneficiary.phone} onChangeText={(text) => setBeneficiary({ ...beneficiary, phone: text })} />
        
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
  submitButton: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, width: '100%' },
  submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AddBeneficiaries;
