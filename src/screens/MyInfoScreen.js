import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "@myinfo";

const MyInfoScreen = () => {
  const [myInfo, setMyInfo] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [snsLinked, setSnsLinked] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigation = useNavigation();

  const toggleSwitch = () => {
    setSnsLinked((previousState) => !previousState);
    setNotificationEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    loadMyInfo();
  }, []);

  const loadMyInfo = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s !== null) {
        setMyInfo(JSON.parse(s));
      }
    } catch (error) {
      console.log("Error loading MyInfo:", error);
    }
  };

  const saveInfo = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const addInfo = async () => {
    if (name && phone && email) {
      const newInfo = {
        name,
        phone,
        email,
        snsLinked,
        notificationEnabled,
        isSaved: true,
      };
      await saveInfo(newInfo);
      setMyInfo(newInfo);
      setIsSaved(true);
    } else {
      Alert.alert("모든 항목을 입력해주세요.");
    }
  };
  console.log(myInfo.isSaved);

  const deleteInfo = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: async () => {
          setIsSaved(false);
          await AsyncStorage.removeItem(STORAGE_KEY);
          navigation.navigate("Login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 정보</Text>
      {!myInfo.isSaved && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요."
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>휴대폰번호</Text>
            <TextInput
              style={styles.input}
              placeholder="휴대폰번호를 입력하세요."
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일주소</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일주소를 입력하세요."
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>SNS 연동</Text>
            <Switch value={snsLinked} onValueChange={toggleSwitch} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>알림 수신</Text>
            <Switch value={notificationEnabled} onValueChange={toggleSwitch} />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={addInfo}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </>
      )}
      {myInfo.isSaved && (
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberInfoTitle}>저장된 정보:</Text>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>이름</Text>
            <Text style={styles.memberInfoValue}>{myInfo.name}</Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>휴대폰번호</Text>
            <Text style={styles.memberInfoValue}>{myInfo.phone}</Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>이메일주소</Text>
            <Text style={styles.memberInfoValue}>{myInfo.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButtonContainer}
            onPress={() => deleteInfo()}
          >
            <Text style={styles.deleteButtonText}>탈퇴하기</Text>
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#87CEEB",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  deleteButtonContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FF0000",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
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

export default MyInfoScreen;
