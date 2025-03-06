import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const SupervisorHome = () => {
  const { logout, user } = useAuth(); // Assuming user object contains phone number
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('index'); 
  };

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <View style={styles.profileSection}>
          <Image source={require('@/assets/images/profile.webp')} style={styles.profileIcon} />
          <Text style={styles.phoneNumber}>{user?.phone || 'Phone Number'}</Text>
        </View>
        <Button title="Logout" onPress={handleLogout} color="black" />
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        <OptionButton icon="user-plus" text="Add Worker" onPress={() => navigation.navigate('AddWorker')} />
        <OptionButton icon="user-edit" text="Update Worker" onPress={() => navigation.navigate('UpdateWorker')} />
        <OptionButton icon="clipboard-list" text="Worker Attendance" onPress={() => navigation.navigate('WorkerAttendance')} />
        <OptionButton icon="user-check" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendance')} />
      </View>
    </View>
  );
};

const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={24} color="#d32f2f" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#b71c1c',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  phoneNumber: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SupervisorHome;
