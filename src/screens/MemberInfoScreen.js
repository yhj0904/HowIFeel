import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const STORAGE_KEY = "@member";

const MemberInfoScreen = () => {
  const [memberInfo, setMemberInfo] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const { email, name } = JSON.parse(jsonValue);
          setMemberInfo({ email, name });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMemberInfo();
  }, []);

  return (
    <View style={styles.container}>
      {memberInfo ? (
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberInfoTitle}>저장된 정보:</Text>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>Email</Text>
            <Text style={styles.memberInfoValue}>{memberInfo.email}</Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>Name</Text>
            <Text style={styles.memberInfoValue}>{memberInfo.name}</Text>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          setIsLoggedIn(false);
          await AsyncStorage.setItem("isLoggedIn", "false");
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  logoutButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FF0000",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  memberInfoContainer: {
    marginTop: 24,
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 8,
  },
  memberInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  memberInfoItem: {
    marginBottom: 8,
  },
  memberInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  memberInfoValue: {
    fontSize: 16,
    color: "#555",
  },
});

export default MemberInfoScreen;
