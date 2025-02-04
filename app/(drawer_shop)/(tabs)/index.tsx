import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface PaymentNotification {
  payment_id: string;
  student_name: string;
  shop_name: string;
  payable_amount: number;
  payment_status: string;
  payment_date: string;
  payment_received: boolean;
  min_discount: number;
  max_discount: number;
}

const PaymentNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (!token) {
          Alert.alert('Error', 'Authentication token is missing.');
          return;
        }

        const response = await axios.get<{ status: number; data: { payments: PaymentNotification[] } }>(
          'http://54.211.207.66/api/v1/Shop/shop/payment_Notification/',
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          setNotifications(response.data.data.payments);
        } else {
          Alert.alert('Error', 'Failed to fetch notifications.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        Alert.alert('Error', 'An error occurred while fetching payment notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00A86B" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.payment_id}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
            
              <Text style={styles.text}>Student: {item.student_name}</Text>
              <Text style={styles.text}>Shop: {item.shop_name}</Text>
              <Text style={styles.text}>Amount: ₹{item.payable_amount}</Text>
              <Text style={styles.text}>Date: {new Date(item.payment_date).toLocaleString()}</Text>
                 <TouchableOpacity style={styles.verify}>
                              <Text style={styles.texty}>
                                 Verify Amount
                              </Text>
                            </TouchableOpacity>
              
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No payment notifications available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D4EBF8',
  },
  notificationCard: {
    backgroundColor: '#F5EFFF',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    borderColor: 'black',
    borderWidth: 0.2,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  verify:{
    backgroundColor:'#DE3163',
    color:'#FFEDFA',
    width:100,
    padding:5  },
  texty:{
   
    color:'#DAD2FF'
  }
});

export default PaymentNotifications;