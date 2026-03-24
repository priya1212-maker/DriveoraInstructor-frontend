import { StyleSheet, Text, View } from "react-native";

function Navbar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Driveora Instructor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef7ff",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#123a72",
  },
});

export default Navbar;
