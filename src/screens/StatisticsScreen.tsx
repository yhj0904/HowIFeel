import React, { useRef, useState, useContext, useEffect} from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../contexts/AuthContext";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const determineStorageKey = (isLoggedIn) => {
  return isLoggedIn ? "@LogtoDos" : "@toDos";
};


const StatisticsScreen = () => {
  const [toDos, setTodos] = useState({});
  const { isLoggedIn } = useContext(AuthContext);
  const STORAGE_KEY = determineStorageKey(isLoggedIn);

  const moods = ["😱", "😧", "😡", "😢", "😐", "😄", "🤢"];

  useEffect(() => {
    loadToDos();
  }, []);
  
  const loadToDos = async () => {
    try {
      const ds = await AsyncStorage.getItem(STORAGE_KEY); // 저장된 내용 불러오기
      const loadedToDos = JSON.parse(ds);
      setTodos(loadedToDos || {});
    } catch (e) {
      setTodos({});
    }
  };
  


  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  // Animations
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
  });
  // Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  // State
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    setIndex((prev) => prev + 1);
    position.setValue(0);
    // Animated.timing(position, { toValue: 0, useNativeDriver: true }).start();
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
        <Text style={{ fontSize: 20 }}>
       {toDos[Object.keys(toDos)[0] + 1]?.date}
      </Text>
      <Text style={{ fontSize: 98 }}>
       {moods[toDos[Object.keys(toDos)[0] + 1]?.analysis]}
      </Text>
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Text style={{ fontSize: 20 }}>
       {toDos[Object.keys(toDos)[0]]?.date}
      </Text>
          <Text style={{ fontSize: 98 }}>
        {moods[toDos[Object.keys(toDos)[0]]?.analysis]}
      </Text>
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" color="white" size={58} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
export default StatisticsScreen;
