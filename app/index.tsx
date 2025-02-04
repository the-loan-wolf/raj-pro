import { Text, View,TouchableOpacity,StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
export default function Index() {
  const router = useRouter();
  const handlePress =()=>{
     router.navigate('./signin')
  }
  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome Page </Text>
       <TouchableOpacity onPress={handlePress}>
           <Text >Continue</Text>
       </TouchableOpacity>
    </View>
  );
}
const styles= StyleSheet.create({
     

})
