import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';

import api from '../services/api';

import logo from "../assets/logo.png";

export default function Login(props) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        props.navigation.navigate("Main", { user });
      }
    });
  }, [props.navigation]);

  async function handleLogin() {
    const response = await api.post('/devs', { username: user });

    const { _id } = response.data;

    await AsyncStorage.setItem("user", _id);

    props.navigation.navigate('Main', { user: _id });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled={Platform.OS === "ios"}
    >
      <Image source={logo} />

      <TextInput
        placeholder=" Digite seu usuario no github "
        placeholderTextColor="#999"
        style={styles.input}
        autoCapitalize="none"
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Enviar </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: "#DF4723",
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: "center",
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
