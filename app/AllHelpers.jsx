import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  RefreshControl, SafeAreaView, Modal, TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const AllHelpers = () => {
  const navigation = useNavigation();

  // Static Helper Data (For Now)
  const [helpers, setHelpers] = useState([
    { id: '1', name: 'Rahul Sharma', phone: '9876543210', aadhar: '1234-5678-9012' },
    { id: '2', name: 'Priya Verma', phone: '8765432109', aadhar: '2345-6789-0123' },
    { id: '3', name: 'Amit Kumar', phone: '7654321098', aadhar: '3456-7890-1234' },
    { id: '4', name: 'Sneha Patel', phone: '6543210987', aadhar: '4567-8901-2345' },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAadhar, setEditedAadhar] = useState('');

  // Refresh Function (Simulated for Now)
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Uncomment this when API is ready
    // fetchHelpers();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Delete Helper Function
  const deleteHelper = (id) => {
    setHelpers(helpers.filter((helper) => helper.id !== id));
  };

  // Open Edit Modal
  const openEditModal = (helper) => {
    setSelectedHelper(helper);
    setEditedName(helper.name);
    setEditedPhone(helper.phone);
    setEditedAadhar(helper.aadhar);
    setEditModalVisible(true);
  };

  // Save Edited Data
  const saveChanges = () => {
    setHelpers((prevHelpers) =>
      prevHelpers.map((helper) =>
        helper.id === selectedHelper.id
          ? { ...helper, name: editedName, phone: editedPhone, aadhar: editedAadhar }
          : helper
      )
    );
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>All Helpers</Text>
      </View>

      {/* Helper List */}
      <FlatList
        data={helpers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.helperCard}>
            <View style={styles.helperInfo}>
              <Text style={styles.helperText}><Text style={styles.boldText}>Name:</Text> {item.name}</Text>
              <Text style={styles.helperText}><Text style={styles.boldText}>Phone:</Text> {item.phone}</Text>
              <Text style={styles.helperText}><Text style={styles.boldText}>Aadhar:</Text> {item.aadhar}</Text>
            </View>
            
            {/* Edit & Delete Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <MaterialIcons name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteHelper(item.id)} style={styles.actionButton}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Helper</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Name" 
              value={editedName} 
              onChangeText={setEditedName} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Phone" 
              value={editedPhone} 
              onChangeText={setEditedPhone} 
              keyboardType="phone-pad"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Aadhar" 
              value={editedAadhar} 
              onChangeText={setEditedAadhar} 
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  navBar: { width: '100%', height: 60, backgroundColor: 'darkred', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 5 },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white' },
  helperCard: { backgroundColor: 'white', padding: 15, marginVertical: 8, marginHorizontal: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  helperInfo: { flex: 1 },
  helperText: { fontSize: 16, color: '#333', marginBottom: 5 },
  boldText: { fontWeight: 'bold' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { marginLeft: 10, padding: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', marginTop: 10 },
  saveButton: { backgroundColor: 'green', padding: 10, borderRadius: 5, marginRight: 10 },
  cancelButton: { backgroundColor: 'red', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default AllHelpers;
