import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation, setIsLoggedIn, setUserProfile }) => {
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!idNumber.trim() || !fullName.trim() || !password.trim()) {
      Alert.alert('Signup Failed', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const storedUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const existingUser = storedUsers.find(u => u.idNumber === idNumber);

      if (existingUser) {
        Alert.alert('Signup Failed', 'ID Number already exists.');
      } else {
        const newUser = { idNumber, fullName, password };
        const updatedUsers = [...storedUsers, newUser];
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

        setUserProfile(newUser);
        setIsLoggedIn(true);
        Alert.alert('Signup Successful', `Welcome, ${fullName}!`);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Signup Failed', 'An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up for USTP Playlist Connect</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="ID Number"
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          placeholderTextColor="#95a5a6"
        />
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#95a5a6"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#95a5a6"
        />
      </View>



      {loading ? (
        <ActivityIndicator size="large" color="#6200ea" />
      ) : (
        <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.redirectText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  socialButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  redirectText: {
    color: '#1DB954',
    marginTop: 20,
    fontSize: 14,
  },
});

export default SignupScreen;
