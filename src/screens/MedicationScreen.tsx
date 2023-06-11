import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogMedication" : "@medication";
};
const MedicationScreen = () => {
  const [medications, setMedications] = useState([]);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [numberOfDosage, setNumberOfDosage] = useState("1");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);
  const navigation = useNavigation();
  
  const toggleTimeSelection = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };


  const isTimeSelected = (time) => selectedTimes.includes(time);

  useEffect(() => {
    loadMedication();
  }, []);

  const saveMedication = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadMedication = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s !== null) {
        setMedications(JSON.parse(s));
      }
    } catch (error) {
      console.log("Error loading medication:", error);
    }
  };

  const addMedication = async () => {
    if (medName && selectedTimes) {
      const newMed = Object.assign({}, medications, {
        [Date.now()]: {
          uniqueNumber,
          medName,
          dosage: parseFloat(dosage).toFixed(1),
          selectedTimes,
          numberOfDosage,
        },
      });
      setMedications(newMed);
      await saveMedication(newMed);
      setMedName("");
      setDosage("");
      setNumberOfDosage("1");
      setSelectedTimes([]);
      setUniqueNumber("");
      closeModal();
      Alert.alert("약물이 추가되었습니다.");
    } else {
      Alert.alert("모든 항목을 입력해주세요.");
    }
  };

  const deleteMedication = (key) => {
    Alert.alert("Delete medication?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          const newMed = { ...medications };
          delete newMed[key];
          setMedications(newMed);
          saveMedication(newMed);
          Alert.alert("약물이 삭제되었습니다.");
        },
      },
    ]);
    return;
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setMedName("");
    setDosage("");
    setNumberOfDosage("1");
    setSelectedTimes([]);
    setUniqueNumber("");
  };

  const mediInfo = () => {

  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>내가 복용 중인 약</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MedicationSearchScreen");
        }}
        style={styles.searchButton}
      >
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openModal} style={styles.addButton}>
        <Text style={styles.buttonText}>추가하기</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="고유번호"
            value={uniqueNumber}
            onChangeText={(text) => setUniqueNumber(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="처방의약품 명칭"
            value={medName}
            onChangeText={(text) => setMedName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="용량(mg)"
            keyboardType="decimal-pad"
            value={dosage}
            onChangeText={(text) => setDosage(text)}
          />
          <Text style={styles.label}>1회 복용량(알)</Text>
          <Picker
            style={styles.picker}
            selectedValue={numberOfDosage}
            mode="dropdown"
            onValueChange={(itemValue) => setNumberOfDosage(itemValue)}
          >
            {[...Array(20).keys()].map((value) => (
              <Picker.Item
                key={value}
                label={`${value + 0.5}`}
                value={`${value + 0.5}`}
              />
            ))}
          </Picker>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>복용시간</Text>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isTimeSelected("아침 복용") && styles.checkboxSelected,
              ]}
              onPress={() => toggleTimeSelection("아침 복용")}
            >
              <Text style={styles.checkboxText}>아침</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isTimeSelected("점심 복용") && styles.checkboxSelected,
              ]}
              onPress={() => toggleTimeSelection("점심 복용")}
            >
              <Text style={styles.checkboxText}>점심</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isTimeSelected("저녁 복용") && styles.checkboxSelected,
              ]}
              onPress={() => toggleTimeSelection("저녁 복용")}
            >
              <Text style={styles.checkboxText}>저녁</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isTimeSelected("자기전 복용") && styles.checkboxSelected,
              ]}
              onPress={() => toggleTimeSelection("자기전 복용")}
            >
              <Text style={styles.checkboxText}>자기전</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={addMedication} style={styles.addButton}>
            <Text style={styles.buttonText}>추가</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView>
        {Object.keys(medications).map((key) =>
          medications[key].key !== null ? (
            <View key={key} style={styles.medicationContainer}>
              <TouchableOpacity onPress={() => { mediInfo }}>
                <MaterialCommunityIcons name="pill" size={35} color="black" />
              </TouchableOpacity>
              <View>
                <Text style={styles.medicationText}>
                  {medications[key].medName}
                </Text>
                <Text style={styles.medicationText}>
                  {medications[key].dosage} mg
                </Text>
                <Text style={styles.medicationText}>
                  {medications[key].numberOfDosage}알
                </Text>
                {medications[key].selectedTimes.map((time) => (
                  <Text key={time} style={styles.selectedTimeText}>
                    {time}
                  </Text>
                ))}
              </View>

              <TouchableOpacity onPress={() => deleteMedication(key)}>
                <Fontisto name="trash" size={16} color="grey" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
        {Object.keys(medications).length === 0 && (
          <Text style={styles.noMedicationText}>
            복용중인 약물이 없어요. 새로운 정보를 입력해주세요.
          </Text>
        )}
      </ScrollView>
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
  addButton: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#87CEEB", //
    alignItems: "center",
  },
  cancelButton: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#ccc",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  picker: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  timeContainer: {
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkboxSelected: {
    backgroundColor: "#87CEEB",
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  medicationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  medicationText: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    color: "#333",
  },
  selectedTimeText: {
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#333",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  noMedicationText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  searchButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
});

export default MedicationScreen;
