import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SubscriptionScreen = ({ navigation }) => {
  const handleSubscription = (plan, price) => {
    // Navigate to TransactionScreen with plan details and price
    navigation.navigate('TransactionScreen', { plan, price });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>₱75 for 3 months of Premium</Text>
        <Text style={styles.subtitle}>
          Enjoy ad-free music, offline playback, and more. Cancel anytime.
        </Text>

        {/* Plans Section */}
        <View style={styles.plansContainer}>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Mini</Text>
            <Text style={styles.planPrice}>₱7 for 1 week</Text>
            <Text style={styles.planDetails}>1 Premium account</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#1ED760' }]}
              onPress={() => handleSubscription('Mini', 7)}
            >
              <Text style={styles.buttonText}>Get Premium Mini</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Individual</Text>
            <Text style={styles.planPrice}>₱75 for 3 months</Text>
            <Text style={styles.planDetails}>1 Premium account</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#F037A5' }]}
              onPress={() => handleSubscription('Individual', 75)}
            >
              <Text style={styles.buttonText}>Get Premium Individual</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Family</Text>
            <Text style={styles.planPrice}>₱129 for 1 month</Text>
            <Text style={styles.planDetails}>Up to 6 Premium accounts</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#509BF5' }]}
              onPress={() => handleSubscription('Family', 129)}
            >
              <Text style={styles.buttonText}>Get Premium Family</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Duo</Text>
            <Text style={styles.planPrice}>₱99 for 1 month</Text>
            <Text style={styles.planDetails}>2 Premium accounts</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FFC83E' }]}
              onPress={() => handleSubscription('Duo', 99)}
            >
              <Text style={styles.buttonText}>Get Premium Duo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  plansContainer: {
    width: '90%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planCard: {
    width: '48%',
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    color: '#1DB954',
    marginBottom: 5,
  },
  planDetails: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SubscriptionScreen;
