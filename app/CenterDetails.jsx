import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const CenterDetails = () => {
  const navigation = useNavigation();

  // Local Data (Replace with API data later)
  const data = {
    centerCode: "C12345",
    centerName: "Bright Future Center",
    address: "Golaght",
  };

  /*
  // Uncomment this when using API
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenterDetails();
  }, []);

  const fetchCenterDetails = async () => {
    try {
      const response = await axios.get("https://api.example.com/center-details"); 
      setData(response.data);
    } catch (error) {
      console.error("Error fetching center details:", error);
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Center Details */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Center Code:</Text>
          <Text style={styles.value}>{data.centerCode}</Text>

          <Text style={styles.label}>Center Name:</Text>
          <Text style={styles.value}>{data.centerName}</Text>

          <Text style={styles.label}>Address :</Text>
          <Text style={styles.value}>{data.address}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "darkred",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "darkred",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
});

export default CenterDetails;
