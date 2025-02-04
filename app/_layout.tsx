import { Stack } from "expo-router";

export default function RootLayout() {
  return (<Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name='index' options={{headerShown:false}} />
    <Stack.Screen name='signin' options={{headerShown:false}} />
    <Stack.Screen name='signup' options={{headerShown:false}} />
    <Stack.Screen name="(drawer_shop)" options={{ headerShown: false }} />  
    <Stack.Screen name="(drawer_stud)" options={{ headerShown: false }} />
       
  </Stack>);
}

  
