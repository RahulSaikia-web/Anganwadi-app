import React, { useState,useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, 
  Modal, Button ,Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}
const WorkerHome = () => {
  const navigation = useNavigation();
  const [staffData,setstaffData] = useState()
  const [modalVisible, setModalVisible] = useState(false);


  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () =>  navigation.replace('index')},
    ]);
    
  };
  useEffect(()=>{
      getStudents()
    },[])
  
    const getStudents = async ()=>{
      let JWT_Token = await storeGetValueFor('JWT-Token');

         const apiUrl = 'https://magicminute.online/api/v1/staffs/self/';
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JWT_Token}`, // Add the token here
            },
          });
    
          if (response.ok) {
            const data = await response.json();            
            setstaffData(data);
            console.log(staffData);
            
          } else {
            console.log('Failed to fetch  ');
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <TouchableOpacity style={styles.profileSection} onPress={() => setModalVisible(true)}>
        <Image source={require('@/assets/images/profile.webp')} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>{staffData ? staffData.staff_full_name : "Name"}</Text>
          <Text style={styles.userLocation}>{staffData ? staffData.staff_phone : '0000000000'}</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionCard}>
          <FontAwesome5 name="users" size={24} color="white" />
          <Text style={styles.quickActionText}>Beneficiaries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard}>
          <FontAwesome5 name="calendar-check" size={24} color="white" />
          <Text style={styles.quickActionText}>Daily Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard}>
          <FontAwesome5 name="home" size={24} color="white" />
          <Text style={styles.quickActionText}>Home Visits</Text>
        </TouchableOpacity>
      </View>

      {/* Action Center */}
      <Text style={styles.actionCenterTitle}>Action Center</Text>
      <View style={styles.actionGrid}>
        <OptionButton icon="user-plus" text="Add Student" onPress={() => navigation.navigate('AddStudent')} />
        <OptionButton icon="users" text="All Helpers" onPress={() => navigation.navigate('AllHelpers')} />
        <OptionButton icon="user-plus" text="Add Helper" onPress={() => navigation.navigate('AddHelper')} />
        <OptionButton icon="user-check" text="Staff Attendance" onPress={() => navigation.navigate('SelfAttendance')} />
        <OptionButton icon="user" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendance')} />
        <OptionButton icon="users" text="All Student" onPress={() => navigation.navigate('AllStudent')} />
        <OptionButton icon="clipboard-list" text="Attendance" onPress={() => navigation.navigate('Attendance')} />
        <OptionButton icon="school" text="Center Details" onPress={() => navigation.navigate('CenterDetails')} />
        <OptionButton icon="shopping-bag" text="Ration" onPress={() => navigation.navigate('Ration')} />
        <OptionButton icon="home" text="Home Visit" onPress={() => navigation.navigate('HomeVisit')} />
        <OptionButton icon="cogs" text="Settings" onPress={() => navigation.navigate('Settings')} />
        <OptionButton icon="user-plus" text="Add Beneficiaries" onPress={() => navigation.navigate('AddBeneficiaries')} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
      {/* Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{staffData ? staffData.staff_full_name : "Name"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{staffData ? staffData.staff_phone : '0000000000'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Aadhar:</Text>
              <Text style={styles.detailValue}>{staffData ? staffData.staff_aadhar : '0000000000'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role:</Text>
              <Text style={styles.detailValue}>{staffData ? staffData.staff_role : 'Who are You'}</Text>
            </View>
           
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// OptionButton component to handle navigation
const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={24} color="#d32f2f" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
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

  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  detailLabel: { fontSize: 16, fontWeight: 'bold' },
  detailValue: { fontSize: 16, color: '#333' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#d32f2f', padding: 12, borderRadius: 5, marginTop: 20, width: '100%', justifyContent: 'center' },
  logoutText: { color: 'white', fontSize: 16, marginLeft: 5 },
  closeButton: { marginTop: 10 },
  closeText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold' },
});

export default WorkerHome;
