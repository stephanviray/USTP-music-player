import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [profile, setProfile] = useState({ name: '', image: null });
  const [nowPlaying, setNowPlaying] = useState({ name: '', artist: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState({ id: null, name: '', artist: '' });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const { fullName, profileImage } = JSON.parse(userData);
          setProfile({ name: fullName || 'Guest', image: profileImage });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchProfile();

    const unsubscribe = navigation.addListener('focus', fetchProfile);
    return unsubscribe;
  }, [navigation]);

  const copyFileToDocumentDirectory = async (uri) => {
    const fileName = uri.split('/').pop();
    const newUri = FileSystem.documentDirectory + fileName;
    await FileSystem.copyAsync({ from: uri, to: newUri });
    return newUri;
  };

  const selectAndAddSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const { uri, name, mimeType } = result.assets[0];

        if (mimeType && mimeType.startsWith('audio')) {
          const newUri = await copyFileToDocumentDirectory(uri);
          const newSong = {
            id: Math.random().toString(),
            name: name || 'Untitled',
            artist: 'Unknown Artist',
            uri: newUri,
          };

          setSongs((prevSongs) => [...prevSongs, newSong]);
          Alert.alert('Success', `Added: ${newSong.name}`);
        } else {
          Alert.alert('Invalid File', 'Please select a valid audio file.');
        }
      } else {
        Alert.alert('Action Canceled', 'No file selected.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not select file. Please try again.');
    }
  };

  const playAudio = async (uri, song) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setPlayingId(song.id);
      setNowPlaying({ name: song.name, artist: song.artist });
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlayingId(null);
          setNowPlaying({ name: '', artist: '' });
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Could not play the audio file.');
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const toggleSelectSong = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs((prevSelected) =>
        prevSelected.filter((songId) => songId !== id)
      );
    } else {
      setSelectedSongs((prevSelected) => [...prevSelected, id]);
    }
  };

  const deleteSelectedSongs = () => {
    setSongs((prevSongs) =>
      prevSongs.filter((song) => !selectedSongs.includes(song.id))
    );
    setSelectedSongs([]);
    Alert.alert('Removed', 'Selected songs have been removed.');
  };

  const startEditing = (song) => {
    setEditDetails(song);
    setIsEditing(true);
  };

  const saveEditDetails = () => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === editDetails.id
          ? { ...song, name: editDetails.name, artist: editDetails.artist }
          : song
      )
    );
    setIsEditing(false);
    setEditDetails({ id: null, name: '', artist: '' });
  };

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {profile.image ? (
          <Image source={{ uri: profile.image }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfileImage}>
            <Text style={{ fontSize: 20, color: '#ccc' }}>👤</Text>
          </View>
        )}
        <Text style={styles.profileName}>{profile.name}</Text>
      </View>

      <Text style={styles.title}>Music Player</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search songs"
          placeholderTextColor="#7f8c8d"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.songsContainer}>
        <Text style={styles.songsTitle}>Your Playlist</Text>
        {filteredSongs.length === 0 ? (
          <Text style={styles.noSongsText}>
            {searchText ? 'No songs found.' : 'No songs added yet. Add your first song!'}
          </Text>
        ) : (
          <ScrollView>
            {filteredSongs.map((item) => (
              <View key={item.id} style={styles.songItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleSelectSong(item.id)}
                >
                  <Ionicons
                    name={selectedSongs.includes(item.id) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#1DB954"
                  />
                </TouchableOpacity>
                <View style={styles.songDetails}>
                  <Text style={styles.songName}>{item.name}</Text>
                  <Text style={styles.songArtist}>{item.artist}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    playingId === item.id ? pauseAudio() : playAudio(item.uri, item)
                  }
                >
                  <Ionicons
                    name={
                      playingId === item.id && isPlaying
                        ? 'pause-circle-outline'
                        : 'play-circle-outline'
                    }
                    size={32}
                    color="#1DB954"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startEditing(item)}>
                  <Ionicons name="create-outline" size={24} color="#f39c12" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {/* Now Playing Section */}
      {nowPlaying.name ? (
        <View style={styles.nowPlayingContainer}>
          <Text style={styles.nowPlayingText}>Now Playing: {nowPlaying.name}</Text>
          <Text style={styles.nowPlayingArtist}>Artist: {nowPlaying.artist}</Text>
          <View style={styles.nowPlayingActions}>
            {isPlaying ? (
              <TouchableOpacity onPress={pauseAudio}>
                <Ionicons name="pause-circle" size={40} color="#1DB954" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={resumeAudio}>
                <Ionicons name="play-circle" size={40} color="#1DB954" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : null}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={selectAndAddSong}>
          <Text style={styles.addButtonText}>Add Song</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { opacity: selectedSongs.length ? 1 : 0.5 }]}
          onPress={deleteSelectedSongs}
          disabled={selectedSongs.length === 0}
        >
          <Text style={styles.deleteButtonText}>Remove Selected</Text>
        </TouchableOpacity>
      </View>
      {/* Edit Song Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Song Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Song Name"
              placeholderTextColor="#7f8c8d"
              value={editDetails.name}
              onChangeText={(text) => setEditDetails((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Artist"
              placeholderTextColor="#7f8c8d"
              value={editDetails.artist}
              onChangeText={(text) => setEditDetails((prev) => ({ ...prev, artist: text }))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={saveEditDetails}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#fff',
  },
  songsContainer: {
    flex: 1,
    color: '#7f8c8d',
  },
  songsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 10,
  },
  noSongsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    marginRight: 10,
  },
  songDetails: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffff',
  },
  songArtist: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  nowPlayingContainer: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  nowPlayingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 5,
  },
  nowPlayingArtist: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  nowPlayingActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultProfileImage: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MusicPlayer;
