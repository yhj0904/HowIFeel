import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet,Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LineChart} from 'react-native-charts-wrapper';
import AuthContext from "../contexts/AuthContext";

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
};

const Statistics = () => {
  const [toDos, setToDos] = useState({}); // 변수명 변경: setTodos -> setToDos
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);

  useEffect(() => {
    loadToDos();
  }, []);

  const loadToDos = async () => {
    try {
      const ds = await AsyncStorage.getItem(STORAGE_KEY);
      if (ds !== null) {
        const loadedToDos = JSON.parse(ds);
        console.log("Loaded todos:", loadedToDos); // 데이터 확인을 위한 로그
        setToDos(loadedToDos);
      } else {
        console.log("No data found in AsyncStorage");
      }
    } catch (error) {
      console.log("Error loading data from AsyncStorage:", error);
    }
  };
  

  const moodData = Object.values(toDos).map((item) => item.mood); // Object.keys를 Object.values로 변경
  const monthlyMoods = {};
  
  Object.values(toDos).forEach((item) => {
    const date = item.date;
    const month = date.split("-")[1];
    if (!monthlyMoods[month]) {
      monthlyMoods[month] = [];
    }
    monthlyMoods[month].push(item.mood);
  });

  const monthlyAverages = Object.keys(monthlyMoods).map((month) => {
    const monthMoods = monthlyMoods[month];
    const sum = monthMoods.reduce((acc, val) => acc + val, 0);
    return sum / monthMoods.length;
  });

  return (
    <View>
      <View>
        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: moodData,
              },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>
      <View>
        <LineChart
          data={{
            labels: Object.keys(monthlyMoods),
            datasets: [
              {
                data: monthlyAverages,
              },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 10,
  },
});

export default Statistics;
