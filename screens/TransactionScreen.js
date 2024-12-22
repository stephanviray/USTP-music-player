import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TransactionScreen = ({ route, navigation }) => {
  const { plan, price } = route.params; // Retrieve the plan and price from the params
  const [gcashNumber, setGcashNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [premium, setPremium] = useState(false); // State for premium
  const [totalPrice, setTotalPrice] = useState(price);

  // Function to toggle premium status
  const togglePremium = () => {
    setPremium((prev) => !prev);
  };

  useEffect(() => {
    // Update the total price if premium is applied
    const updatedPrice = premium ? price - 10 : price; // Apply 10 PHP discount if premium is selected
    setTotalPrice(updatedPrice);
  }, [premium, price]);

  const handlePayment = () => {
    if (!paymentMethod) {
      Alert.alert('Missing Information', 'Please select a payment method.');
      return;
    }

    if (paymentMethod === 'GCash' && !gcashNumber) {
      Alert.alert('Missing Information', 'Please provide your GCash number.');
      return;
    }

    Alert.alert(
      'Payment Success',
      `Your payment for the ${plan} plan (₱${totalPrice.toFixed(2)}) has been successfully processed.`
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Plan: {plan}</Text>
        <Text style={styles.summaryText}>Total: ₱{totalPrice.toFixed(2)}</Text>
        {premium && <Text style={styles.summaryText}>Premium Applied</Text>}
      </View>

      <Text style={styles.paymentMethodLabel}>Payment Method</Text>
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'GCash' && styles.selectedOption]}
          onPress={() => setPaymentMethod('GCash')}
        >
          <Text style={styles.paymentOptionText}>GCash</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'GCash' && (
        <TextInput
          style={styles.input}
          placeholder="Enter your GCash Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={gcashNumber}
          onChangeText={setGcashNumber}
        />
      )}

      <TouchableOpacity style={styles.completeButton} onPress={togglePremium}>
        <Text style={styles.completeButtonText}>Promo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.completeButton} onPress={handlePayment}>
        <Text style={styles.completeButtonText}>Complete Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  paymentMethodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentOption: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#1ED760',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionScreen;
