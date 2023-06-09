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
import { Fontisto } from "@expo/vector-icons";
import { Header, Text, ButtonGroup, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
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
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);

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
      const ds = await AsyncStorage.getItem(STORAGE_KEY); // 저장된 내용 불러오기
      const loadedToDos = JSON.parse(ds);
      setTodos(loadedToDos || {});
    } catch (e) {
      setTodos({});
    }
  };

  const addToDo = async () => {
    setAddModalVisible(false);

    if (diary === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { diary, mood, date },
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
      const newToDos = { ...todos };
      newToDos[selectedTodo] = { ...newToDos[selectedTodo], diary, mood };
      setTodos(newToDos);
      saveToDos(newToDos);
      setSelectedTodo(null);
      setEditModalVisible(false);
    }
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
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].date === date ? (
              <View style={styles.toDo} key={key}>
                <Text style={{ fontSize: 36 }}>
                  {moods[toDos[key].mood]}
                  <Button
                    title="일지 보기"
                    type="clear"
                    onPress={() => alert(toDos[key].diary)}
                  />
                </Text>
                <TouchableOpacity onPress={() => updateToDo(key)}>
                  <Text>수정</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={16} color="grey" />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>

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
              onPress={() => setAddModalVisible(false)}
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
              multiline={true}
              numberOfLines={4}
              value={diary}
            />
            <Button title="저장" onPress={editToDo} />
            <Button
              title="취소"
              onPress={() => setEditModalVisible(false)}
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
    height: 100,
    width: "100%",
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
});

// 아이콘 추가
// todo 구조 추가 object ture or false
// 함수를 만들어서 key값으로 toDo를 찾고
// 새로 state에 둔다.
// todo를 수정 true || false && diary
//mutate 금지.
// 새로운 object를 생성 ex) newToDos[key] = {edit : true}
//
