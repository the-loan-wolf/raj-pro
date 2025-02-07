import { StyleSheet, Text, View } from 'react-native'
type Props = {}
const thanks = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>thanks</Text>
    </View>
  )
}
export default thanks

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})