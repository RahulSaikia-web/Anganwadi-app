import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const WorkerHome = () => {
  const { logout, user } = useAuth(); // Assuming user object contains phone number
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('index');
  };

  return (
    <ImageBackground source={require('@/assets/images/bg-ds.jpg')} style={styles.background} blurRadius={10}>
      <View style={styles.container}>
        {/* Worker Info Section */}
        <View style={styles.userInfoContainer}>
          <View style={styles.profileSection}>
            <Image source={require('@/assets/images/profile.webp')} style={styles.profileIcon} />
            <Text style={styles.phoneNumber}>{user?.phone || 'Phone Number'}</Text>
          </View>
          <Button title="Logout" onPress={handleLogout} color="black" />
        </View>

        {/* Options Section */}
        <View style={styles.optionsWrapper}>
          <View style={styles.optionsContainer}>
            <OptionButton icon="user-plus" text="Add Student" onPress={() => navigation.navigate('AddStudent')} />
            <OptionButton icon="user-check" text="Self Attendance" onPress={() => navigation.navigate('SelfAttendance')} />
            <OptionButton icon="users" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendance')} />
            <OptionButton icon="home" text="Home Visit" onPress={() => navigation.navigate('HomeVisit')} />
            <OptionButton icon="hand-holding-heart" text="Beneficiaries" onPress={() => navigation.navigate('Beneficiaries')} />
            <OptionButton icon="ellipsis-h" text="More" onPress={() => navigation.navigate('More')} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <FontAwesome5 name={icon} size={30} color="#d32f2f" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adding slight transparency to make text readable
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(183, 28, 28, 0.9)',
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
  optionsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    padding: 20,
  },
  optionButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default WorkerHome;
