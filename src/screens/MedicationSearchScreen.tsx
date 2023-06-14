import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";
import { Picker } from "@react-native-picker/picker";

const Container = styled.View``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  alignitems: center;
  justifycontent: space-between;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
`;
const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogMedication" : "@medication";
};

const MedicationSearchScreen = () => {
  const [search, setSearch] = useState("");
  const [medications, setMedications] = useState({});
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [takeToMedi, setTakeToMedi] = useState("");
  const [entpName, setEntpName] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [cautionInfo, setCautionInfo] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [numberOfDosage, setNumberOfDosage] = useState("1");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [mediInfoModalVisible, setMediInfoModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);

  useEffect(() => {
    loadMedication();
  }, []);


  const onSubmit = () => {
    setSearchResults([]);
    if (search === "") {
      return;
    }

    if (/^\d+$/.test(search)) {
      fetch(`http://3.37.226.225:10021/api/drug/find`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drugCode: search,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.result) {
            setSearchResults([data.result]);
            setUniqueNumber(data.result.drugCode);
            setMedName(data.result.drugName);
            setTakeToMedi(data.result.drugHowTake);
            setEntpName(data.result.drugEntpName);
            setSideEffect(data.result.drugSideEffect);
            setCautionInfo(data.result.drugWarn);
            console.log("API response:", data);
          } else {
            Alert.alert("해당하는 약물 코드는 존재하지 않습니다.");
          }
        })
        .catch((error) => {
          console.error("API error:", error);
        });
    } else {
      fetch(`http://3.37.226.225:10021/api/drug/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drugName: search,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.result) {
            setSearchResults((prevResults) => [...prevResults, ...data.result]);
            setUniqueNumber(data.result.drugCode);
            setMedName(data.result.drugName);
            setTakeToMedi(data.result.drugHowTake);
            setEntpName(data.result.drugEntpName);
            setSideEffect(data.result.drugSideEffect);
            setCautionInfo(data.result.drugWarn);
            console.log("API response:", data);
          } else {
            // Display an alert or modal for "Drug name does not exist"
            Alert.alert("해당하는 약물 이름은 존재하지 않습니다.");
          }
        })
        .catch((error) => {
          console.error("API error:", error);
        });
      console.log("Search is not an integer");
    }
  };

  console.log(search);

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

  const toggleTimeSelection = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const isTimeSelected = (time) => selectedTimes.includes(time);

  const saveMedication = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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

  const closeModal = () => {
    setIsModalVisible(false);
    setMedName("");
    setDosage("");
    setNumberOfDosage("1");
    setSelectedTimes([]);
    setUniqueNumber("");
  };
  return (
    <Container>
      <SearchBar
        placeholder="Search for id or name"
        placeholderTextColor="grey"
        returnKeyType="search"
        value={search}
        onChangeText={(text) => setSearch(text)}
        onSubmitEditing={onSubmit}
      />

      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <View style={styles.medicationContainer}>
            <View>
              <Text style={styles.medicationText}>
                고유번호: {item.drugCode}
              </Text>
              <Text style={styles.medicationText}>
                약 이름: {item.drugName}
              </Text>
              <Text style={styles.medicationText}>
                제조사: {item.drugEntpName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setMediInfoModalVisible(true);
                setTakeToMedi(item.drugHowTake);
          setSideEffect(item.drugSideEffect);
          setCautionInfo(item.drugWarn);
              }}
            >
              <FontAwesome name="list" size={24} color="grey" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setMedName(item.drugName);
                setUniqueNumber(item.drugCode);
              }}
            >
              <FontAwesome5 name="briefcase-medical" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.drugCode} // (필요 시 수정) 각 항목의 고유 키 지정
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={mediInfoModalVisible}
      >
        <ModalContainer>
          <ModalContent>
            <Text style={styles.medicationText}>{takeToMedi}</Text>
            <Text style={styles.medicationText}>{sideEffect}</Text>
            <Text style={styles.medicationText}>{cautionInfo}</Text>

            <TouchableOpacity
              onPress={() => {
                setMediInfoModalVisible(false);
              }}
            >
              <FontAwesome5 name="window-close" size={24} color="black" />
            </TouchableOpacity>
          </ModalContent>
        </ModalContainer>
      </Modal>

      <Modal visible={isModalVisible}>
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
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  medicationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
});

export default MedicationSearchScreen;
