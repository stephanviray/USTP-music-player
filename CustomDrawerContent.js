import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDrawerContent = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerTitle}>Menu</Text>

      <TouchableOpacity onPress={() => navigation.navigate('USTP Player')} style={styles.drawerButton}>
        <Text style={styles.drawerButtonText}>Playlist</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile Edit')} style={styles.drawerButton}>
        <Text style={styles.drawerButtonText}>Profile Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Subscription Plan')} style={styles.drawerButton}>
        <Text style={styles.drawerButtonText}>Subscription Plans</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.drawerButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  drawerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ecf0f1',
    marginBottom: 20,
  },
  drawerButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  drawerButtonText: {
    fontSize: 18,
    color: '#ecf0f1',
  },
  logoutButton: {
    paddingVertical: 15,
    marginTop: 'auto',
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CustomDrawerContent;
