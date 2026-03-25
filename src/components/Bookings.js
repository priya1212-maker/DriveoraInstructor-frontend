import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function Bookings({ bookings = [], loading, onRefresh, onStatusChange }) {
  useEffect(() => {
    bookings.forEach((booking) => {
      const lessonTime = new Date(`${booking.date} ${booking.time}`);
      const now = new Date();
      const diffInMinutes = (lessonTime - now) / (1000 * 60);

      if (booking.status === "accepted" && diffInMinutes > 0 && diffInMinutes < 60) {
        Alert.alert("Reminder", `${booking.learner?.name || "A learner"} starts within 1 hour.`);
      }
    });
  }, [bookings]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Bookings</Text>
        <Pressable style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color="#2563eb" style={styles.loader} /> : null}

      {bookings.length === 0 && !loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>Student lesson requests will appear here once they book you.</Text>
        </View>
      ) : null}

      {bookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <Text style={styles.name}>{booking.learner?.name || `Learner #${booking.userId}`}</Text>
          <Text style={styles.meta}>Date: {new Date(booking.date).toDateString()}</Text>
          <Text style={styles.meta}>Time: {booking.time}</Text>
          <Text style={styles.meta}>Contact: {booking.learner?.phone || "Not available"}</Text>
          <Text style={styles.status}>
            Status: <Text style={styles.statusValue}>{booking.status}</Text>
          </Text>

          {booking.status === "pending" ? (
            <View style={styles.actionsRow}>
              <Pressable style={[styles.button, styles.acceptButton]} onPress={() => onStatusChange(booking.id, "accepted")}>
                <Text style={styles.buttonLightText}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.rejectButton]} onPress={() => onStatusChange(booking.id, "cancelled")}>
                <Text style={styles.buttonDarkText}>Reject</Text>
              </Pressable>
            </View>
          ) : null}

          {booking.status === "accepted" ? (
            <Pressable style={[styles.button, styles.completeButton]} onPress={() => onStatusChange(booking.id, "completed")}>
              <Text style={styles.buttonLightText}>Mark Completed</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#123a72",
  },
  refreshButton: {
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  refreshButtonText: {
    color: "#123a72",
    fontWeight: "700",
  },
  loader: {
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#123a72",
    marginBottom: 6,
  },
  emptyText: {
    color: "#475569",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#123a72",
  },
  meta: {
    marginBottom: 4,
    fontSize: 14,
    color: "#334155",
  },
  status: {
    fontSize: 14,
    color: "#0f172a",
    marginTop: 4,
    marginBottom: 12,
  },
  statusValue: {
    fontWeight: "700",
    textTransform: "capitalize",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  acceptButton: {
    backgroundColor: "#2563eb",
  },
  rejectButton: {
    backgroundColor: "#eff6ff",
  },
  completeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1d4ed8",
  },
  buttonLightText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  buttonDarkText: {
    color: "#123a72",
    fontWeight: "700",
  },
});

export default Bookings;
