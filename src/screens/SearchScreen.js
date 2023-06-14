import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
  Button,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { Fontisto, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
`;

const SearchResultsContainer = styled.View`
  margin-top: 20px;
  padding: 10px;
`;

const SearchResult = styled.View`
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
`;

const DateText = styled.Text`
  font-size: 20px;
  color: gray;
`;

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
};

const Search = () => {
  const [mood, setMood] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [memberInfo, setMemberInfo] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const [diary, setDiary] = useState("");
  const [toDos, setTodos] = useState({});
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDiaryModalVisible, setShowDiaryModalVisible] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);
  const moods = ["😱", "😧", "😡", "😢", "😐", "😄", "🤢"];
  const onChangeText = (payload) => setDiary(payload);

  useEffect(() => {
    loadToDos();
  }, []);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); // 비동기 저장소 jSON 파싱
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem("@member");
      const memberInfo = JSON.parse(s);
      setMemberInfo(memberInfo);
      const ds = await AsyncStorage.getItem(STORAGE_KEY); // 저장된 내용 불러오기
      const loadedToDos = JSON.parse(ds);
      setTodos(loadedToDos || {});
    } catch (e) {
      setTodos({});
    }
  };


  const deleteToDo = (key) => {
    Alert.alert("delete To Do?", "are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm sure",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setTodos(newToDos);
          saveToDos(newToDos);
          Alert.alert("기록이 삭제되었습니다.");
        },
      },
    ]);
    return;
  };

  const updateToDo = (key) => {
    setSelectedTodo(key);
    setDiary(toDos[key].diary);
    setEditModalVisible(true);
  };

  const editToDo = () => {
    if (selectedTodo) {
      const newToDos = { ...toDos };
      newToDos[selectedTodo] = { ...newToDos[selectedTodo], diary};
      setTodos(newToDos);
      saveToDos(newToDos);
      setSelectedTodo(null);
      setEditModalVisible(false);
    }
  };

  const serverEditTodos = () => {
    fetch(`http://3.37.226.225:10021/api/journal/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId : memberInfo.email,
          id : diaryUniqNum,
          date : date, 
          content : diary ,
          mood : mood,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAnalysis(data.analysis)
          console.log("API response:", data);
        })
        .catch((error) => {
          console.error("API error:", error);
        });
  }

  const serverdelTodos = (key) => {
    fetch(`http://3.37.226.225:10021/api/journal/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId : memberInfo.email,
        id : diaryUniqNum,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }

  const checkdiary = (key) => {
    setSelectedTodo(key);
    setShowDiaryModalVisible(true);
  };

  const allTodo = () => {
    const results =
      searchResults.length > 0 ? (searchResults) : (Object.keys(toDos));
    return (
      <SearchResult>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            전체 일지
          </Text>
        </View>
        <View style={styles.log}>
          {Object.keys(toDos)
            .sort((a, b) => new Date(toDos[a].date) - new Date(toDos[b].date))
            .map((key) => (
              <View key={key}>
                <DateText>{toDos[key].date}</DateText>
                <View style={styles.toDo} key={key}>
                  <Text style={{ fontSize: 36 }}>{moods[toDos[key].analysis]}</Text>
                  <View style={styles.buttonKey}>
                    <TouchableOpacity onPress={() => checkdiary(key)}>
                      <MaterialCommunityIcons
                        name="book-open-variant"
                        size={24}
                        color="grey"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => updateToDo(key)}>
                      <Entypo name="pencil" size={24} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={24} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </SearchResult>
    );
  };

  const onSubmit = () => {
      fetch(`http://3.37.226.225:10021/api/journal/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId : memberInfo.email,
          date : searchQuery, 
          analysis : mood,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSearchResults((prevResults) => [...prevResults, ...data.result])
          console.log("API response:", data);
         
        })
        .catch((error) => {
          console.error("API error:", error);
        });
  };

  console.log(searchResults)
  const batchQuery = () => {
    
  }

  return (
    <Container>
      <View style={styles.mood}>
        <ButtonGroup
          buttons={moods}
          containerStyle={{ height: 50, borderRadius: 10 }}
          onPress={(index) => setMood(index)}
          selectedIndex={mood}
        />
      </View>
      <SearchBar
        placeholder="Search for mood, diary keyword, date."
        placeholderTextColor="grey"
        returnKeyType="search"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={onSubmit}
      />

      <SearchResultsContainer>{allTodo()}</SearchResultsContainer>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDiaryModalVisible}
      >
        <View style={styles.diaryModalContainer}>
          <View style={styles.diaryModalView}>
            <Text style={styles.diaryModalHeader}>일기 확인</Text>
            <ScrollView>
              <Text style={styles.diaryText}>
                {selectedTodo && toDos[selectedTodo]?.diary}
              </Text>
            </ScrollView>
            <Button
              title="닫기"
              onPress={() => setShowDiaryModalVisible(false)}
              buttonStyle={styles.closeButton}
              titleStyle={styles.closeButtonText}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>일지를 작성해보세요:</Text>
            <TextInput
              onChangeText={onChangeText}
              returnKeyType="done"
              style={styles.diaryInput}
              multiline={true}
              numberOfLines={4}
              value={diary}
            />
            <Button title="저장" onPress={editToDo} />
            <Button
              title="취소"
              onPress={() => {
                setDiary("");
                setEditModalVisible(false);
              }}
              type="outline"
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  mood: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    overflow: "visible",
  },
  log: {
    flex: 2,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    overflow: "visible",
  },
  toDo: {
    backgroundColor: "#A0A0FF",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonKey: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
  },
  diaryModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  diaryModalView: {
    height: Dimensions.get("window").height * 0.4,
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    maxHeight: Dimensions.get("window").height * 0.4,
    maxHeight: Dimensions.get("window").width * 0.7,
  },
  diaryModalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  diaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#8C8CFF",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  diaryInput: {
    height: Dimensions.get("window").height * 0.25,
    width: Dimensions.get("window").width * 0.8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});

export default Search;
