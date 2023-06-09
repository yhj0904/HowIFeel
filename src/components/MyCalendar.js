import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar, DotMarking } from "react-native-calendars";
import MoodTracker from "./MoodTracker.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
};

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [todos, setTodos] = useState({});
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);

  useEffect(() => {
    loadToDos();
  }, [selectedDate]);

  console.log("rander")

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const updateSelectedDates = (date) => {
    setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
    console.log("mycalendar", date);
  };

  const loadToDos = async () => {
    try {
      const ds = await AsyncStorage.getItem(STORAGE_KEY);
      const loadedToDos = JSON.parse(ds);
      setTodos(loadedToDos || {});
    } catch (e) {
      setTodos({});
    }
  };

  const getMarkedDates = () => {
    const markedDates = {};
  
    Object.values(todos).forEach((todo) => {
      if (!markedDates[todo.date]) {
        markedDates[todo.date] = {};
      }
  
      if (!markedDates[todo.date].dots) {
        markedDates[todo.date].dots = [];
      }
  
      markedDates[todo.date].dots.push({
        key: todo.id,
        color: "red",
        selectedColor: "blue",
      });
  
      markedDates[todo.date].selected = selectedDate === todo.date;
      markedDates[todo.date].selectedColor = "blue";
    });
  
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDateSelect}
        markingType={"multi-dot"}
        markedDates={{[selectedDate]: {
            selected: true,
            dotColor: "blue",
            selectedDotColor: "blue",
          }, ...getMarkedDates()}}
      />
      {selectedDate && (
        <MoodTracker
          date={selectedDate}
          setSelectedDate={setSelectedDate}
          updateSelectedDates={updateSelectedDates}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    width: Dimensions.get("window").width,
  },
});
