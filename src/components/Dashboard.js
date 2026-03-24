import { StyleSheet, Text, View } from "react-native";

function Dashboard() {
  return (
    <View>
      <Text style={styles.heading}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Bookings</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Today's Lessons</Text>
        <Text style={styles.value}>3</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Earnings</Text>
        <Text style={styles.value}>Rs 2500</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#123a72",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#60a5fa",
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    color: "#475569",
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: "#123a72",
  },
});

export default Dashboard;
