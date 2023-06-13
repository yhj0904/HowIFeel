import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Fontisto, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { Header, Text, ButtonGroup, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
};

const determineStorageKey2 = (isLoggedIn) => {
  return isLoggedIn ? "@member" : "@myinfo";
};

export default function MoodTracker({
  date,
  setSelectedDate,
  updateSelectedDates,
}) {
  const [mood, setMood] = useState(2);
  const [diary, setDiary] = useState(""); // 완
  const [toDos, setTodos] = useState({}); // 완
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDiaryModalVisible, setShowDiaryModalVisible] = useState(false);
  const [memberInfo, setMemberInfo] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [diaryUniqNum, setdiaryUniqNum] = useState({});
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);
  const STORAGE_KEY2 = determineStorageKey2(isLoggedIn);

  const moods = ["😭", "😕", "😐", "🙂", "😍"];

  
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
      console.log(loadedToDos)
      setTodos(loadedToDos || {});
    } catch (e) {
      setTodos({});
    }
  };

  const addToDo = async () => {
    setAddModalVisible(false);
    serverSaveTodos();
    if (diary === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { diary, mood, date, analysis },
    }); // , 찍고 일 추가 .기분은 , 찍고 기분 변수 추가.F

    setTodos(newToDos);
    await saveToDos(newToDos);
    setDiary("");
    updateSelectedDates(date);
   
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
          serverdelTodos();
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
      newToDos[selectedTodo] = { ...newToDos[selectedTodo], diary, mood };
      setTodos(newToDos);
      saveToDos(newToDos);
      setSelectedTodo(null);
      setEditModalVisible(false);
      serverEditTodos();  // 저장된 내용을 넘겨서 API호출??
    }
  };

  const serverLoadTodos = () => {
    fetch(`http://3.37.226.225:10021/api/journal/load`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId : memberInfo.email,
          date : date, 
          content : diary,
          mood : mood,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAnalysis(data.analysis);
          setdiaryUniqNum(data.id);
          console.log("API response:", data);
        })
        .catch((error) => {
          console.error("API error:", error);
        });
  }

  const serverSaveTodos = () => {
    fetch(`http://3.37.226.225:10021/api/journal/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId : memberInfo.email,
          date : date, 
          content : diary,
          mood : mood,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAnalysis(data.analysis);
          setdiaryUniqNum(data.id);
          console.log("API response:", data);
        })
        .catch((error) => {
          console.error("API error:", error);
        });
  }

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

  const serverdelTodos = () => {
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

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: "기록하기",
          style: { color: "#fff", fontSize: 24 },
        }}
        backgroundColor="#2c3e50"
        rightComponent={{
          icon: "close",
          color: "#fff",
          onPress: () => setSelectedDate(null),
        }}
      />
      <ScrollView>
        <View style={styles.mood}>
          <ButtonGroup
            buttons={moods}
            containerStyle={{ height: 50, borderRadius: 10 }}
            onPress={(index) => setMood(index)}
            selectedIndex={mood}
          />
          <Button
            title="작성하기"
            onPress={() => setAddModalVisible(true)}
            buttonStyle={{ backgroundColor: "#2c3e50", marginTop: 5 }}
          />
        </View>

        <View style={styles.log}>
          <Text h4 style={{ textAlign: "center", marginBottom: 10 }}>
            {" "}
            {date}
          </Text>

          {Object.keys(toDos).map((key) =>
            toDos[key].date === date ? (
              <View style={styles.toDo} key={key}>
                <Text style={{ fontSize: 36 }}>{moods[toDos[key].mood]}</Text>
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
                    <Fontisto name="trash" size={16} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          )}
        </View>
      </ScrollView>

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
              <Text style={styles.diaryText}>
              {selectedTodo && toDos[selectedTodo]?.analysis}
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

      <Modal animationType="slide" transparent={true} visible={addModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>오늘의 기분은 어떤가요?</Text>
            <ButtonGroup
              buttons={moods}
              containerStyle={{ height: 50, borderRadius: 10 }}
              onPress={(index) => setMood(index)}
              selectedIndex={mood}
            />
            <Text style={styles.modalHeader}>일지를 작성해보세요:</Text>

            <TextInput
              // onEndEditing={addToDo}
              onChangeText={onChangeText}
              returnKeyType="done"
              style={styles.diaryInput}
              multiline={true}
              numberOfLines={4} // 완
              value={diary}
            />
            <Button title="저장" onPress={addToDo} />
            <Button
              title="취소"
              onPress={() => {
                setDiary("");
                setAddModalVisible(false);
              }}
              type="outline"
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
            <Text style={styles.modalHeader}>오늘의 기분은 어떤가요?</Text>
            <ButtonGroup
              buttons={moods}
              containerStyle={{ height: 50, borderRadius: 10 }}
              onPress={(index) => setMood(index)}
              selectedIndex={mood}
            />
            <Text style={styles.modalHeader}>일지를 작성해보세요:</Text>

            <TextInput
              onChangeText={onChangeText}
              returnKeyType="done"
              style={styles.diaryInput}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "#ecf0f1",
  },
  mood: {
    flex: 1,
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
    backgroundColor: "#2c3e50",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

// 아이콘 추가
// todo 구조 추가 object ture or false
// 함수를 만들어서 key값으로 toDo를 찾고
// 새로 state에 둔다.
// todo를 수정 true || false && diary
//mutate 금지.
// 새로운 object를 생성 ex) newToDos[key] = {edit : true}
//
