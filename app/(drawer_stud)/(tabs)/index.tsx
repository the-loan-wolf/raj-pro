import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  FlatList, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Install this package if not already installed
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type Shop = {
  id: string;
  shop_name: string;
  address: string;
  zip_code: string;
  contact_number: string;
  category: string;
  opening_time: string;
  closing_time: string;
  min_discount:string;
  max_discount:string
};

const Landing: React.FC = () => {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [uniqueAddresses, setUniqueAddresses] = useState<string[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (!token) {
          Alert.alert('Error', 'Authentication token is missing.');
          return;
        }
        const response = await axios.get('http://54.211.207.66/api/v1/Shop/shops/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        });
  
        if (response.data.status === 200) {
          const shopData = response.data.data as Shop[]; // Explicitly cast response data to Shop[]
          setShops(shopData);
          setFilteredShops(shopData);
          const addresses = Array.from(new Set(shopData.map((shop) => shop.address))) as string[]; // Explicitly cast as string[]
          setUniqueAddresses(addresses);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to fetch shops.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        Alert.alert('Error', 'An error occurred while fetching shop data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchShops();
  }, []);
  

  const handleAddressFilter = (address: string) => {
    setSelectedAddress(address);
    console.log(address)
    // console.log(shops)
    if (address==" ") {
      setFilteredShops(shops);
    } else {
      setFilteredShops(shops.filter(shop => shop.address === address));
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${ampm}`;
  };

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
      }

      const response = await axios.post(
        'http://54.211.207.66/api/v1/auth/logout/',
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        await SecureStore.deleteItemAsync('authToken');
        Alert.alert('Logged Out', 'You have successfully logged out.');
        router.push('../signin');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };
  const handleSelect = async (id: string,min:string,max:string) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
      }
  
      const response = await axios.get(`http://54.211.207.66/api/v1/Shop/shops/${id}/`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        },
      });
  
      if (response.data.status === 200) {
        const shopDetails = response.data.data;
        // Alert.alert('Shop Details', `You selected ${shopDetails.shop_name}.`);
        router.replace(`./amount?id=${id}&min=${min}&max=${max}`);

      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch shop details.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Fetching shop details failed.');
    }
  };
  ;

  const renderShop = ({ item }: { item: Shop }) => (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtiYeQq82-HVJyUPwtunX9sjyW867mTdKvg&s' }} // Placeholder image
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.name}>{item.shop_name}</Text>
        <Text style={styles.address}>{item.address}, {item.zip_code}</Text>
        <Text style={styles.contact}>Contact: {item.contact_number}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <Text style={styles.hours}>
          Open: {formatTime(item.opening_time)} - Close: {formatTime(item.closing_time)}
        </Text >
        <Text style={styles.offer}>
          Offer Range {item.min_discount} to {item.max_discount}
        </Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelect(item.id,item.min_discount,item.max_discount)} >
        
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.container1}>
        <Text style={styles.headerText}>Top Rated Outlets</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View> */}

      {loading ? (
        <ActivityIndicator size="large" color="#00A86B" />
      ) : (
        <>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(itemValue) => handleAddressFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Addresses" value=" " />
            {uniqueAddresses.map((address, index) => (
              <Picker.Item key={index} label={address} value={address} />
            ))}
          </Picker>

          {filteredShops.length > 0 ? (
            <FlatList
              data={filteredShops}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderShop}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>No shops available for the selected address.</Text>
          )}
        </>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4EBF8',
    paddingHorizontal: 16,
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#A6AEBF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#B03052',
    padding: 8,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: width * 0.9,
    alignSelf: 'center',
    marginVertical: 10,
    // Add border width
    // Set border color
    borderRadius: 5, // Optional: for rounded corners
    backgroundColor: 'white',
    borderColor: 'black', // Set border color
  borderWidth: 5, // Set border width to make it visible // Optional: set background color
}
,
cardContainer: {
  flexDirection: 'row',
  padding: 16,
  backgroundColor: '#F5EFFF',
  borderRadius: 12,
  marginVertical: 10,
  width: width * 0.9,
  alignSelf: 'center',
  borderColor: 'black', // Set border color
  borderWidth: 0.15, // Set border width to make it visible
},

  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hours: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  offer:{
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#B03052',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default Landing;
