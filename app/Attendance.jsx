import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

async function storeGetValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
}


const Attendance = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getStudentsAttendance();
  }, []);

  const getStudentsAttendance = async () => {
    console.log("got data");

    try {
      let JWT_Token = await storeGetValueFor('JWT-Token');
      const apiUrl = 'https://magicminute.online/api/v1/attendance/students/';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_Token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);/// attendane data
        
      } else {
        console.log('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
    }
  }

  const filters = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Current Month', value: 'currentMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Find by Date', value: 'customDate' }
  ];

  const studentNames = [
    "Aarav Patel", "Ishaan Sharma", "Ananya Verma", "Diya Kapoor", "Rohan Mehta",
    "Kabir Joshi", "Aditi Singh", "Neha Choudhary", "Aryan Gupta", "Sanya Malhotra",
    "Siddharth Rao", "Rhea Jain", "Manav Khanna", "Tara Bose", "Vihaan Das",
    "Meera Roy", "Vivaan Nair", "Ritika Pillai", "Kunal Menon", "Simran D'Souza"
  ];

  const attendanceData = studentNames.map((name, i) => ({
    id: (i + 1).toString(),
    serial: i + 1,
    name,
    date: `2025-03-${String(7 - (i % 7)).padStart(2, '0')}`,
    status: i % 2 === 0 ? 'Present' : 'Absent',
  }));

  const filterAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    return attendanceData.filter((item) => {
      const itemDate = new Date(item.date);
      if (filter === 'today') return item.date === today;
      if (filter === 'thisWeek') return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
      if (filter === 'currentMonth') return itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
      if (filter === 'lastMonth') return itemDate.getMonth() + 1 === lastMonth && itemDate.getFullYear() === lastMonthYear;
      if (filter === 'yearly') return itemDate.getFullYear() === currentYear;
      if (filter === 'customDate' && customDate) return item.date.startsWith(customDate);
      return true;
    });
  };

  const filteredData = filterAttendance();




  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>All Attendance</Text>
      </View>

      {/* Filter Section */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.filterText}>Filter By: {filters.find(f => f.value === filter)?.label}</Text>
        <FontAwesome5 name="chevron-down" size={16} color="white" />
      </TouchableOpacity>

      {/* Custom Date Input */}
      {filter === 'customDate' && (
        <TextInput
          style={styles.dateInput}
          placeholder="Type Date (YYYY-MM-DD)"
          value={customDate}
          onChangeText={setCustomDate}
        />
      )}

      {/* Attendance List */}
      {filteredData.length === 0 ? (
        <Text style={styles.noResults}> Sorry! We cannot find attendance on this Date.</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.attendanceItem}>
              <View style={styles.nameColumn}>
                <Text style={styles.boldText}>{item.serial}. {item.name}</Text>
              </View>
              <View style={styles.dateColumn}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View>
                <Text style={[styles.status, item.status === 'Present' ? styles.present : styles.absent]}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filter</Text>
            {filters.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => {
                  setFilter(item.value);
                  setModalVisible(false);
                }}
              >
                <FontAwesome5
                  name={filter === item.value ? "dot-circle" : "circle"}
                  size={20}
                  color="red"
                  style={styles.radioIcon}
                />
                <Text style={styles.modalText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#b71c1c', padding: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 18, marginLeft: 5 },
  navTitle: { fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 15 },
  filterButton: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#b71c1c', margin: 10, borderRadius: 5 },
  filterText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  dateInput: { borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 },
  noResults: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'red', fontWeight: 'bold' },
  attendanceItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  nameColumn: { flex: 2 },
  dateColumn: { flex: 1, alignItems: 'center' },
  boldText: { fontWeight: 'bold', fontSize: 16 },
  dateText: { fontSize: 16, color: '#555' },
  present: { color: 'green' },
  absent: { color: 'red' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: 250 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  radioIcon: { marginRight: 10 },
  closeButton: { marginTop: 15, backgroundColor: 'red', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', textAlign: 'center' }
});

export default Attendance;
