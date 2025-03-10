import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, 
  Modal, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function getStoredToken(key) {
  let token = await SecureStore.getItemAsync(key);
  return token ? token : null;
}

const SupervisorHome = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [supervisorData, setSupervisorData] = useState(null);

  useEffect(() => {
    fetchSupervisorDetails();
  }, []);

  const fetchSupervisorDetails = async () => {
    let JWT_Token = await getStoredToken('JWT-Token');
    const apiUrl = 'https://magicminute.online/api/v1/anganwadi/';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_Token}`,
        },
      });
      let data = await response.json()
      console.log(data);
      
      if (response.ok) {
        const data = await response.json();
        setSupervisorData(data);
      } else {
        console.error('Failed to fetch supervisor details');
        
      }
    } catch (error) {
      console.error('Error fetching supervisor details 2:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.replace('index') },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection} onPress={() => setModalVisible(true)}>
          <Image source={require('@/assets/images/profile.webp')} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>{supervisorData ? supervisorData.officer_full_name : "Name"}</Text>
            <Text style={styles.userLocation}>{supervisorData ? supervisorData.officer_phone : "0000000000"}</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction icon="clipboard-list" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendenceSupervisor')} />
          <QuickAction icon="clipboard-list" text="Staff Attendance" onPress={() => navigation.navigate('StaffAttendance')} />
          <QuickAction icon="shopping-bag" text="Ration History" onPress={() => navigation.navigate('RationHistory')} />
        </View>

        {/* Action Center */}
        <Text style={styles.actionCenterTitle}>Action Center</Text>
        <View style={styles.actionGrid}>
          <OptionButton icon="user-plus" text="Add Staff" onPress={() => navigation.navigate('AddStaff')} />
          <OptionButton icon="users" text="Staff List" onPress={() => navigation.navigate('StaffList')} />
          <OptionButton icon="users" text="Student List" onPress={() => navigation.navigate('StudentList')} />
          <OptionButton icon="user-edit" text="Update Staff" onPress={() => navigation.navigate('UpdateStaff')} />
          <OptionButton icon="school" text="Add Center" onPress={() => navigation.navigate('AddCenter')} />
          <OptionButton icon="clipboard-list" text="Center List" onPress={() => navigation.navigate('CenterList')} />
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white"  />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{supervisorData ? supervisorData.officer_full_name : "Name"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{supervisorData ? supervisorData.officer_email : "0000000000"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role:</Text>
              <Text style={styles.detailValue}>{supervisorData ? supervisorData.officer_role : "Unknown"}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable Components
const QuickAction = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
    <FontAwesome5 name={icon} size={24} color="white" />
    <Text style={styles.quickActionText}>{text}</Text>
  </TouchableOpacity>
);

const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={24} color="#d32f2f" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'darkred' },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userName: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  userLocation: { fontSize: 14, color: 'white' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  quickActionCard: { backgroundColor: '#d32f2f', padding: 20, borderRadius: 10, alignItems: 'center', width: 100 },
  quickActionText: { color: 'white', marginTop: 10, fontSize: 14, textAlign: 'center' },
  actionCenterTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  optionButton: { backgroundColor: 'white', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', width: 100, elevation: 3 },
  optionText: { fontSize: 12, marginTop: 5, textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  detailLabel: { fontSize: 16, fontWeight: 'bold' },
  detailValue: { fontSize: 16, color: '#333' },
  logoutButton: { backgroundColor: '#d32f2f', padding: 12, borderRadius: 5, justifyContent: 'center', position: 'absolute', bottom: 20, left: 20, right: 20,textAlign:"center",alignItems:"center",display:"flex" },
  logoutText: { color: 'white', fontSize: 16, marginLeft: 5,textAlign:"center" },
  closeButton: { marginTop: 10 },
  closeText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold' },
});

export default SupervisorHome;
