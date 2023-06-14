import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Container = styled.View`
  background-color: black;
  flex: 1;
  align-items: center;
  color: white;
  padding: 60px 20px;
`;
const TextInput = styled.TextInput`
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
`;
const Btn = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 20px;
  border-width: 1px;
  border-radius: 20px;
  border-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
`;
const BtnText = styled.Text`
  color: white;
  font-size: 16px;
`;

const STORAGE_KEY ="@member"

const Join = ({ navigation: { navigate } }) => {
  const passwordInput = useRef();
  const nameInput = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmitEmailEditing = () => {
    passwordInput.current.focus();
  };
  const onSubmitPasswordEditing = () => {
    nameInput.current.focus();
  };

  const onSubmitNameEditing = () => {
    if (email === "" || password === "" || name === "") {
      return Alert.alert("모두 다 입력해주세요.");
    }
    if (loading) {
      return;
    }
    setLoading(true);
    fetch("http://3.37.226.225:10021/api/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.code === "00") {
          await AsyncStorage.setItem(STORAGE_KEY, 
            JSON.stringify({ email, password, name }));
          Alert.alert("가입 성공!");
          navigate("Login");
          setLoading(false);
        } else if (data.code === "10") {
          Alert.alert("해당 이메일 계정은 이미 존재 합니다.");
          setLoading(false);
          return;
        }
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        returnKeyLabel="next"
        returnKeyType="next"
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={onSubmitEmailEditing}
        placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
      />
      <TextInput
        ref={passwordInput}
        placeholder="Password"
        secureTextEntry
        value={password}
        returnKeyLabel="next"
        returnKeyType="next"
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
        onSubmitEditing={onSubmitPasswordEditing}
      />
      <TextInput
        ref={nameInput}
        placeholder="Name"
        value={name}
        autoCorrect={false}
        returnKeyType="done"
        onChangeText={(text) => setName(text)}
        placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
        onSubmitEditing={onSubmitNameEditing}
      />
      <Btn onPress={onSubmitNameEditing}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <BtnText>Create Account</BtnText>
        )}
      </Btn>
    </Container>
  );
};
export default Join;
