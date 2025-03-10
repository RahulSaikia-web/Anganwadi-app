import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const activities = [
  'Morning Assembly',
  'Health Check-up',
  'Teaching Session',
  'Mid-day Meal Distribution',
  'Recreational Activities',
  'End of Day Report'
];

const DailyTracking = () => {
  const navigation = useNavigation();
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResponse = (activity, value) => {
    setResponses({ ...responses, [activity]: value });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      Alert.alert('Success', 'Daily tracking submitted successfully!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Daily Tracking</Text>
      </View>

      {/* Date & Time */}
      <Text style={styles.dateText}>{currentDate.toLocaleString()}</Text>

      {/* Activity List */}
      {activities.map((activity, index) => (
        <View key={index} style={styles.activityRow}>
          <Text style={styles.activityText}>{activity}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.optionButton, responses[activity] === 'Yes' && styles.selectedButton]} 
              onPress={() => handleResponse(activity, 'Yes')}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, responses[activity] === 'No' && styles.selectedButton]} 
              onPress={() => handleResponse(activity, 'No')}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitted && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitted}>
        <Text style={styles.submitText}>{isSubmitted ? 'Submitted' : 'Submit'}</Text>
      </TouchableOpacity>

      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={isSubmitting}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'darkred',
    paddingVertical: 15,
    paddingHorizontal: 10,
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
  navTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 50,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  activityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  optionButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: 'darkred',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'darkred',
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});

export default DailyTracking;
