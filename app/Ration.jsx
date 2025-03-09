import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}
const API_URL = 'https://your-api-endpoint.com/ration'; // Replace with your API endpoint

const Ration = () => {
  
  const navigation = useNavigation();
  const [rationList, setRationList] = useState([{ item: '', quantity: '' }]);
  const [rationStockDataList, setRationStockDataList] = useState([]);

  useEffect(() => {
    fetchRationData();
  }, []);

  // Fetch stored ration data
  const fetchRationData = async () => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await fetch(API_URL, { method: 'GET' });
      const data = await response.json();
      setRationStockDataList(data.ration_entries || []);
    } catch (error) {
      console.error('Error fetching ration data:', error);
    }
  };

  // Add new ration entry field
  const addRationField = () => {
    setRationList([...rationList, { item: '', quantity: '' }]);
  };

  // Remove ration entry field
  const removeRationField = (index) => {
    if (rationList.length > 1) {
      const newRationList = rationList.filter((_, i) => i !== index);
      setRationList(newRationList);
    }
  };

  // Save ration data as a list of objects
  const saveRationStock = async () => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    const filteredRationList = rationList.filter(
      (ration) => ration.item.trim() !== '' && ration.quantity.trim() !== ''
    );

    if (filteredRationList.length === 0) {
      Alert.alert('Error', 'Please enter at least one valid ration entry.');
      return;
    }
    console.log(filteredRationList);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ration_entries: filteredRationList }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Ration saved successfully!');
        fetchRationData();
        setRationList([{ item: '', quantity: '' }]); 
      } else {
        Alert.alert('Error', 'Failed to save ration data.');
      }
    } catch (error) {
      console.error('Error saving ration data:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <View style={{ backgroundColor: 'darkred', padding: 15, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={{ color: 'white', marginLeft: 5, fontSize: 18 }}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ padding: 20 }}>
        {/* Ration Entry */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ration Entry</Text>
        {rationList.map((ration, index) => (
          <View key={index} style={{ marginBottom: 15, backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 3, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder="Ration Item"
                style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 10, fontSize: 16 }}
                value={ration.item}
                onChangeText={(text) => {
                  const newRationList = [...rationList];
                  newRationList[index].item = text;
                  setRationList(newRationList);
                }}
              />
              <TextInput
                placeholder="Quantity"
                style={{ borderBottomWidth: 1, borderColor: '#ccc', fontSize: 16 }}
                value={ration.quantity}
                onChangeText={(text) => {
                  const newRationList = [...rationList];
                  newRationList[index].quantity = text;
                  setRationList(newRationList);
                }}
              />
            </View>
            {rationList.length > 1 && (
              <TouchableOpacity onPress={() => removeRationField(index)}>
                <Ionicons name="remove-circle" size={30} color="darkred" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add More Button */}
        <TouchableOpacity onPress={addRationField} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Ionicons name="add-circle" size={30} color="darkred" />
          <Text style={{ color: 'darkred', fontSize: 18, marginLeft: 5 }}>Add More Ration</Text>
        </TouchableOpacity>

        {/* Save Ration Data */}
        <TouchableOpacity onPress={saveRationStock} style={{ backgroundColor: 'darkred', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Save Ration</Text>
        </TouchableOpacity>

        {/* Ration History */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ration History</Text>
        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 3 }}>
          {rationStockDataList.length > 0 ? (
            rationStockDataList.map((ration, index) => (
              <Text key={index} style={{ fontSize: 16, color: '#555', marginBottom: 5 }}>
                {ration.item} - {ration.quantity}
              </Text>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: '#555' }}>No Ration History Available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Ration;
