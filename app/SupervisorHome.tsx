import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const SupervisorHome = () => {
  const { logout, user } = useAuth(); // Assuming user object contains email
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('index');
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/bg-ds.jpg')} 
      style={styles.background} 
      blurRadius={5} // Apply blur effect
    >
      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <View style={styles.profileSection}>
            <Image source={require('@/assets/images/profile.webp')} style={styles.profileIcon} />
            <Text style={styles.email}>{user?.email || 'Email Address'}</Text>
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
    </ImageBackground>
  );
};

const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={24} color="#d32f2f" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the full screen
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Adds a semi-transparent overlay for better readability
    padding: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(183, 28, 28, 0.8)', // Semi-transparent background
    padding: 20,
    borderRadius: 10,
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
  email: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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