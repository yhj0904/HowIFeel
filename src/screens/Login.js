import React, { useContext ,useRef, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import AuthContext from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
  background-color: black;
  flex: 1;
  color: white;
  justify-content: center;
  padding: 0 20px;
`;

const Wrapper = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const Text = styled.Text`
  font-size: 16px;
  text-align: center;
  color: white;
`;
const Btn = styled.TouchableOpacity``;
const BtnTxt = styled.Text`
  font-size: 16px;
  color: white;
`;
const Btnlog = styled.TouchableOpacity`
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
const Login = ({ navigation: { navigate } }) => {
  const passwordInput = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);


  const onSubmitEmailEditing = () => {
    passwordInput.current.focus();
  };
  const onSubmitPasswordEditing = () => {
    if (email === "" || password === "") {
      return Alert.alert("모두 다 입력해주세요.");
    }
    if (loading) {
      return;
    }
    setLoading(true);
    fetch("http://3.37.226.225:10021/api/account/login-process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.code === "00") {
          Alert.alert("로그인 되었습니다");
          setIsLoggedIn(true);
          try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        } else if (data.code === "10") {
          Alert.alert("비밀번호가 일치 하지 않습니다.");
          setLoading(false);
          return;
        }else if (data.code === "11") {
          Alert.alert("등록된 이메일이 없습니다.");
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
        returnKeyType="done"
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
        onSubmitEditing={onSubmitPasswordEditing}
      />

        <Btnlog onPress={onSubmitPasswordEditing}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <BtnText>Login</BtnText>
        )}
       </Btnlog>
      <Wrapper>
        <Text>Don't have an account? </Text>
        <Btn onPress={() => navigate("Join")}>
          <BtnTxt>Join &rarr;</BtnTxt>
        </Btn>
      </Wrapper>
      <Wrapper>
        <Text> 비회원으로 계속하기 </Text>
        <Btn onPress={() => navigate("Menu")}>
          <BtnTxt>Join &rarr;</BtnTxt>
        </Btn>
      </Wrapper>
    </Container>
  );
};
export default Login;
