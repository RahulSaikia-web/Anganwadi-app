import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Modal, BackHandler } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const WorkerHome = () => {
  const { logout, user } = useAuth(); 
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('index'); 
  };

  return (
    <ImageBackground source={require('@/assets/images/bg-ds.jpg')} style={styles.background} blurRadius={10}>
      <View style={styles.container}>
        {/* Worker Info Section */}
        <View style={styles.userInfoContainer}>
          <TouchableOpacity style={styles.profileSection} onPress={() => setModalVisible(true)}>
            <Image source={require('@/assets/images/profile.webp')} style={styles.profileIcon} />
            <View>
              <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.phoneNumber}>{user?.phone || 'Phone Number'}</Text>
            </View>
          </TouchableOpacity>

          {/* Stylish Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={['#ff6161', '#d32f2f']} style={styles.logoutGradient}>
              <FontAwesome5 name="sign-out-alt" size={18} color="white" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Options Section */}
        <View style={styles.optionsWrapper}>
          <View style={styles.optionsContainer}>
            <OptionButton icon="user-plus" text="Add Student" onPress={() => navigation.navigate('AddStudent')} />
            <OptionButton icon="user-check" text="Self Attendance" onPress={() => navigation.navigate('SelfAttendance')} />
            <OptionButton icon="user" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendance')} />
            <OptionButton icon="users" text="All Student" onPress={() => navigation.navigate('AllStudent')} />
            {/* <OptionButton icon="ellipsis-h" text="More" onPress={() => navigation.navigate('More')} /> */}
            <OptionButton icon="clipboard-list" text="Attendance" onPress={() => navigation.navigate('Attendance')} />
          </View>
        </View>
      </View>

      {/* Modal for User Details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            
            <View style={styles.modalRow}>
              <FontAwesome5 name="user" size={20} color="#333" />
              <Text style={styles.modalText}>Name : {user?.name || 'Not Available'}</Text>
            </View>

            <View style={styles.modalRow}>
              <FontAwesome5 name="phone" size={20} color="#333" />
              <Text style={styles.modalText}>Phone : {user?.phone || 'Not Available'}</Text>
            </View>

            <View style={styles.modalRow}>
              <FontAwesome5 name="user-tag" size={20} color="#333" />
              <Text style={styles.modalText}>Role : {user?.role || 'Not Available'}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
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
  userName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  modalText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WorkerHome;

