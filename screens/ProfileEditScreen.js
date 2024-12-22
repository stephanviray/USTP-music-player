import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileEditScreen = () => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setName(parsedData?.fullName || '');
          setProfileImage(parsedData?.profileImage || null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Access to your photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required!');
      return;
    }

    try {
      const updatedUser = { fullName: name, profileImage };
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack(); // Navigate back to the MusicPlayer
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <View style={styles.container}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.defaultProfileImage}>
          <Text style={{ fontSize: 40, color: '#ccc' }}>👤</Text>
        </View>
      )}
      <TouchableOpacity onPress={handlePickImage}>
        <Text style={styles.buttonText}>Change Profile Image</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#34495e',
    marginVertical: 10,
    borderRadius: 10,
    textAlign: 'center',
    color: '#ecf0f1',
  },
  buttonText: {
    color: '#3498db',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileEditScreen;
