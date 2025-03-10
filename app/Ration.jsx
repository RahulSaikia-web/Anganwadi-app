import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

async function storeGetValueFor(key) {
  try {
    let result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error) {
    console.error(`Error retrieving ${key} from SecureStore:`, error);
    return null;
  }
}

const Ration = () => {
  const navigation = useNavigation();
  const [rationNote, setRationNote] = useState('');
  const [rationList, setRationList] = useState([{ item: '', quantity: '' }]);
  const [rationHistoryList, setRationHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    let JWT_Token = await storeGetValueFor('JWT-Token');
    if (!JWT_Token) {
      Alert.alert('Error', 'Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://magicminute.online/api/v1/rations/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JWT_Token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ration history data:', data.data);
      setRationHistoryList(data.data.reverse() || []);
    } catch (error) {
      console.error('Error fetching ration data:', error);
      Alert.alert('Error', 'Failed to fetch ration history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save ration data
  const saveRationStock = async () => {
    setIsLoading(true);
    let JWT_Token = await storeGetValueFor('JWT-Token');
    if (!JWT_Token) {
      Alert.alert('Error', 'Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    const filteredRationList = rationList.filter(
      (ration) => ration.item.trim() !== '' && ration.quantity.trim() !== ''
    );

    if (filteredRationList.length === 0) {
      Alert.alert('Error', 'Please enter at least one valid ration entry.');
      setIsLoading(false);
      return;
    }

    try {
      let rationData = {
        ration_note: rationNote,
        ration_items: filteredRationList,
      };

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
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Ration details added successfully', [
          {
            text: 'Ok',
            onPress: () => {
              fetchRationData(); // Refresh history after saving
              setRationNote(''); // Clear note
              setRationList([{ item: '', quantity: '' }]); // Reset ration list
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to add ration details. Please try again.');
      }
    } catch (error) {
      console.error('Error saving ration data:', error.response?.data || error);
      Alert.alert('Error', 'Failed to save ration details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Ration detail input */}
        <Text style={styles.sectionTitle}>Ration Note</Text>
        <TextInput
          style={styles.input}
          value={rationNote}
          onChangeText={(value) => setRationNote(value)}
          placeholder="Enter ration note"
          multiline
        />

        <Text style={styles.sectionTitle}>Ration Entry</Text>
        {rationList.map((ration, index) => (
          <View key={index} style={styles.rationEntryCard}>
            <View style={styles.rationEntryInputs}>
              <TextInput
                placeholder="Ration Item"
                style={styles.entryInput}
                value={ration.item}
                onChangeText={(text) => {
                  const newRationList = [...rationList];
                  newRationList[index].item = text;
                  setRationList(newRationList);
                }}
              />
              <TextInput
                placeholder="Quantity"
                style={styles.entryInput}
                value={ration.quantity}
                onChangeText={(text) => {
                  const newRationList = [...rationList];
                  newRationList[index].quantity = text;
                  setRationList(newRationList);
                }}
              />
            </View>
            {rationList.length > 1 && (
              <TouchableOpacity onPress={() => removeRationField(index)} style={styles.removeButton}>
                <Ionicons name="remove-circle" size={30} color="darkred" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add More Button */}
        <TouchableOpacity onPress={addRationField} style={styles.addButton}>
          <Ionicons name="add-circle" size={30} color="darkred" />
          <Text style={styles.addText}>Add More Ration</Text>
        </TouchableOpacity>

        {/* Save Ration Data */}
        <TouchableOpacity onPress={saveRationStock} style={styles.saveButton} disabled={isLoading}>
          <Text style={styles.saveText}>{isLoading ? 'Saving...' : 'Save Ration'}</Text>
        </TouchableOpacity>

        {/* Ration History */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ration History</Text>

{rationHistoryList.length > 0 ? (
  <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 3 }}>
    {rationHistoryList.map((entry, index) => {
      const ration = entry.Rations; // Access the "Rations" key inside each object
      return (
        <View key={index} style={{ marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
          {/* Show Ration Note */}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'darkred' }}>{ration.ration_note}</Text>

          {/* Format and Display Date */}
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
            {new Date(ration.ration_created_date).toLocaleString()}
          </Text>

          {/* Show Ration Items */}
          {ration.ration_items && ration.ration_items.length > 0 ? (
            ration.ration_items.map((item, itemIndex) => (
              <View key={itemIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <Text style={{ fontSize: 16 }}>{item.item}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.quantity}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 14, color: '#888' }}>No items available</Text>
          )}
        </View>
      );
    })}
  </View>
) : (
  <Text style={{ fontSize: 16, color: '#555' }}>No Ration History Available</Text>
)}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    backgroundColor: 'darkred',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 15, // Adjust for iOS status bar
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at the bottom for scroll
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 60, // For multiline input
  },
  rationEntryCard: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rationEntryInputs: {
    flex: 1,
  },
  entryInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontSize: 16,
    paddingVertical: 5,
  },
  removeButton: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addText: {
    color: 'darkred',
    fontSize: 18,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  historyNote: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  historyItemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  historyItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#555',
  },
});

export default Ration;