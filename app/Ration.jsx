import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Ration = () => {
  const navigation = useNavigation();
  const [rationList, setRationList] = useState([{ item: '', quantity: '' }]);
  const [rationDetails, setRationDetails] = useState({ restock_date: '', restock_details: '' });
  const [rationStockDataList, setRationStockDataList] = useState([]);

  const addRationField = () => {
    setRationList([...rationList, { item: '', quantity: '' }]);
  };

  const removeRationField = (index) => {
    if (rationList.length > 1) {
      const newRationList = rationList.filter((_, i) => i !== index);
      setRationList(newRationList);
    }
  };

  const saveRationStock = () => {
    setRationStockDataList([...rationStockDataList, ...rationList]);
    setRationList([{ item: '', quantity: '' }]); // Reset the input fields after saving
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

        {/* Ration Details
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ration Details</Text>
        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 3, marginBottom: 20 }}>
          <TextInput
            placeholder="Restock Date"
            style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 10, fontSize: 16 }}
            value={rationDetails.restock_date}
            onChangeText={(text) => setRationDetails({ ...rationDetails, restock_date: text })}
          />
          <TextInput
            placeholder="Restock Details"
            style={{ borderBottomWidth: 1, borderColor: '#ccc', fontSize: 16 }}
            value={rationDetails.restock_details}
            onChangeText={(text) => setRationDetails({ ...rationDetails, restock_details: text })}
          />
        </View> */}

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
