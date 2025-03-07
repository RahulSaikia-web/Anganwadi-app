import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const WorkerHome = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={require('@/assets/images/profile.webp')} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>Dipalee Das</Text>
          <Text style={styles.userLocation}>Era Dighalpan Das Gaon (18292051008)</Text>
        </View>
      </View>

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
        <OptionButton icon="user-check" text="Self Attendance" onPress={() => navigation.navigate('SelfAttendance')} />
        <OptionButton icon="user" text="Student Attendance" onPress={() => navigation.navigate('StudentAttendance')} />
        <OptionButton icon="users" text="All Student" onPress={() => navigation.navigate('AllStudent')} />
        <OptionButton icon="clipboard-list" text="Attendance" onPress={() => navigation.navigate('Attendance')} />
        <OptionButton icon="school" text="Center Details" onPress={() => navigation.navigate('CenterDetails')} />
        <OptionButton icon="shopping-bag" text="Ration" onPress={() => navigation.navigate('Ration')} />
        <OptionButton icon="home" text="Home Visit" onPress={() => navigation.navigate('HomeVisit')} />
        <OptionButton icon="cogs" text="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d32f2f',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: 14,
    color: 'white',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickActionCard: {
    backgroundColor: '#d32f2f',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },
  quickActionText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  actionCenterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
    elevation: 3,
  },
  optionText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default WorkerHome;
