import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router'; 

import { MaterialIcons } from '@expo/vector-icons';
// Ensure your API instance is correctly set up
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

// Define the type for login data
interface LoginData {
  username: string;
  password: string;
}

// Define the type for the API response
interface ApiResponse {
  data: {
    data: {
      Token: string;
      user_type: string;
    };
  };
  status: number;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>(''); // State for username
  const [password, setPassword] = useState<string>(''); // State for password
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State for toggling password visibility

  const onLogin = async (): Promise<void> => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }  
    
    const loginData: LoginData = {
      username,
      password,
    };

    try {
      const response = (await axios.post(
        'http://54.211.207.66/api/v1/auth/login/',
        loginData
      )) as ApiResponse;

    

      if (response.status === 200) {
        Alert.alert('Login Successful', 'You are now logged in!');

        const Token: string = response.data.data.Token;
        const userType: string = response.data.data.user_type;

        // Store the token in SecureStore or AsyncStorage based on platform
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('authToken', Token);
        } else {
          await SecureStore.setItemAsync('authToken', Token);
        }

        // Navigate based on user type
        if (userType && userType.trim() === 'Shopkeeper') {
          router.push("./(drawer_shop)"); // Correct path for student drawer
        } else {
          router.push('./(drawer_stud)'); // Correct path for shopkeeper drawer
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message =
        error?.response?.data?.message || 'Login Failed. Please try again.';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top side content */}
      <View style={styles.topContent}>
        <Text style={styles.topText}>Welcome Back, Login Here</Text>
      </View>

      {/* Middle content (inputs and button) */}
      <View style={styles.middleContent}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Input with Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on state
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggling password visibility
            style={styles.icon}
          >
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'} // Use visibility icons
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <Button title="Login" onPress={onLogin} />

        {/* Create Account link */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.accountText}>Don't have an account?</Text>
          <Link href="/signup" style={styles.link1}>
            Create Account
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topContent: {
    alignItems: 'center',
    marginTop: 70,
  },
  topText: {
    color: '#10375C',
    fontSize: 20,
    fontWeight: 'bold',
  },
  middleContent: {
    marginTop: -50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    color: '#10375C',
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '80%',
    borderColor: '#ccccc',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#10375C',
  },
  icon: {
    padding: 10,
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    color: '#10375C',
  },
  accountText: {
    fontSize: 14,
    color: '#10375C',
  },
  link1: {
    color: '#0A5EB0',
  },
});

export default Login;
