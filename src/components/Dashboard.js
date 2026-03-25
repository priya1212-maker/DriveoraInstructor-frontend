import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LESSON_FEE = 300;

function Dashboard({ bookings = [], profile, loading }) {
  const todayKey = new Date().toISOString().split("T")[0];
  const totalBookings = bookings.length;
  const todaysLessons = bookings.filter((booking) => booking.date === todayKey).length;
  const completedLessons = bookings.filter((booking) => booking.status === "completed").length;
  const earnings = completedLessons * LESSON_FEE;

  return (
    <View>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.subheading}>
        {profile?.name || "Instructor"} • {profile?.vehicleType || "manual"} lessons
      </Text>

      {loading ? <ActivityIndicator color="#2563eb" style={styles.loader} /> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Total Bookings</Text>
        <Text style={styles.value}>{totalBookings}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Today's Lessons</Text>
        <Text style={styles.value}>{todaysLessons}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completed Lessons</Text>
        <Text style={styles.value}>{completedLessons}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Estimated Earnings</Text>
        <Text style={styles.value}>Rs {earnings}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#123a72",
  },
  subheading: {
    marginBottom: 12,
    color: "#4b6b95",
    fontWeight: "600",
  },
  loader: {
    marginBottom: 12,
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
