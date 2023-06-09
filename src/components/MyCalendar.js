import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import MoodTracker from "./MoodTracker.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const updateSelectedDates = (date) => {
    setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
    console.log(date);
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate]: { selected: true },
          ...selectedDates.reduce((markedDates, date) => {
            markedDates[date] = { marked: true, dotColor: 'red'};
            return markedDates;
          }, {}),
        }}
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
