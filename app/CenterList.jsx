import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CenterList = () => {
  const [centers, setCenters] = useState([]);
  const navigation = useNavigation();

  // Mock API Call / Replace with actual API call
  useEffect(() => {
    const fetchCenters = async () => {
      const centerData = [
        { id: '1', name: 'ABC Training Center', address: '123 Main St, Mumbai', code: 'C001' },
        { id: '2', name: 'XYZ Learning Hub', address: '456 Park Ave, Delhi', code: 'C002' },
        { id: '3', name: 'PQR Skill Academy', address: '789 Hill Rd, Bangalore', code: 'C003' },
        { id: '4', name: 'LMN Coaching Institute', address: '101 Lake View, Kolkata', code: 'C004' },
        { id: '5', name: 'OPQ Training Center', address: '500 Green St, Hyderabad', code: 'C005' },
      ];
      setCenters(centerData);
    };

    fetchCenters();
  }, []);

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView for full page scroll */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.heading}>Center List</Text>
        <FlatList
          data={centers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>📍 {item.address}</Text>
              <Text style={styles.details}>🔢 Code: {item.code}</Text>
            </View>
          )}
          scrollEnabled={false} // Disable FlatList scrolling since ScrollView handles it
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#555',
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
});

export default CenterList;
