import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AllStudent = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [students, setStudents] = useState([
    { id: '1', name: 'Rahul Sharma', phone: '9876543210', mother: 'Anita Sharma', father: 'Rajesh Sharma' },
    { id: '2', name: 'Pooja Verma', phone: '9123456789', mother: 'Sunita Verma', father: 'Rakesh Verma' },
    { id: '3', name: 'Amit Kumar', phone: '9988776655', mother: 'Geeta Kumar', father: 'Suresh Kumar' },
    { id: '4', name: 'Sneha Reddy', phone: '9786543120', mother: 'Priya Reddy', father: 'Vikram Reddy' },
    { id: '5', name: 'Vikas Singh', phone: '9345678123', mother: 'Kavita Singh', father: 'Amit Singh' },
    { id: '6', name: 'Rohan Das', phone: '9012345678', mother: 'Meena Das', father: 'Ashok Das' },
    { id: '7', name: 'Kiran Mehta', phone: '8567452301', mother: 'Alka Mehta', father: 'Suraj Mehta' },
    { id: '8', name: 'Neha Joshi', phone: '7896541230', mother: 'Poonam Joshi', father: 'Vinod Joshi' },
    { id: '9', name: 'Arjun Patel', phone: '7894561230', mother: 'Bhavna Patel', father: 'Ramesh Patel' },
    { id: '10', name: 'Deepika Rao', phone: '7546983210', mother: 'Savita Rao', father: 'Shankar Rao' },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500); 
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <View style={styles.studentCard}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            <View>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.details}>📞 {item.phone}</Text>
              <Text style={styles.details}>👩‍👦 Mother: {item.mother}</Text>
              <Text style={styles.details}>👨‍👦 Father: {item.father}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    width: '100%',
    height: 60,
    backgroundColor: 'darkred',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#d32f2f',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default AllStudent;
