import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}

const Ration = () => {
  
  const navigation = useNavigation();
  const [rationNote, setRationNote] = useState();
  const [rationList, setRationList] = useState([{ item: '', quantity: '' }]);
  const [rationStockDataList, setRationStockDataList] = useState([]);
  const [rationHistoryList, setRationHistoryList] = useState([])

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

  useEffect(() => {
    fetchRationData();
  }, []);

  // Fetch ration data of current center
  const fetchRationData = async () => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    try {
      const response = await fetch('https://magicminute.online/api/v1/rations/', { 
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JWT_Token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      console.log(data.data)
      setRationHistoryList(data.data)
      
    } catch (error) {
      console.error('Error fetching ration data:', error);
    }
  };

  // Save ration data 
  const saveRationStock = async () => {
    let JWT_Token = await storeGetValueFor('JWT-Token');
    const filteredRationList = rationList.filter(
      (ration) => ration.item.trim() !== '' && ration.quantity.trim() !== ''
    );

    if (filteredRationList.length === 0) {
      Alert.alert('Error', 'Please enter at least one valid ration entry.');
      return;
    }

    try {

      let rationData = {
        "ration_note": rationNote,
        "ration_items": filteredRationList
      }

      let JWT_Token = await storeGetValueFor('JWT-Token');
      let config = {
        method: 'post',
        url: 'https://magicminute.online/api/v1/rations/',
        headers: {
          Authorization: 'Bearer ' + JWT_Token,
          'Content-Type': 'application/json',
        },
        data: rationData,
      };
  
      const response = await axios.request(config);
      if (response.status === 200)
      {
        Alert.alert('Success', 'Ration details added successfully', [
          { text: "Ok", onPress: () => navigation.goBack() }
        ]);
      }
      else{
        Alert.alert('error', 'Ration details added successfully', [
          { text: "Try again"}
        ]);
      }

    } catch (error) {
      console.log(error.response?.data || error);
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
        {/* Ration detail input staring*/}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ration Note</Text>

        <TextInput style={styles.input} onChangeText={(value) => setRationNote(value)} />
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
        {/* <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 3 }}> */}
          {rationHistoryList.length > 0 ? (
          <View>
              {/* show ration history */}
          </View>
          ) : (
            <Text style={{ fontSize: 16, color: '#555' }}>No Ration History Available</Text>
          )}
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Ration;
