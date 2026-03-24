import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

function Bookings() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Rahul", time: "10:00 AM", date: "2026-03-22", status: "pending" },
    { id: 2, name: "Priya", time: "02:00 PM", date: "2026-03-23", status: "pending" },
  ]);

  useEffect(() => {
    requests.forEach((booking) => {
      const lessonTime = new Date(`${booking.date} ${booking.time}`);
      const now = new Date();
      const diffInMinutes = (lessonTime - now) / (1000 * 60);

      if (diffInMinutes > 0 && diffInMinutes < 60) {
        Alert.alert("Reminder", "Lesson starting within 1 hour!");
      }
    });
  }, [requests]);

  const acceptBooking = (booking) => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === booking.id ? { ...item, status: "accepted" } : item
      )
    );
  };

  const rejectBooking = (id) => {
    setRequests((currentRequests) =>
      currentRequests.filter((item) => item.id !== id)
    );
  };

  const completeLesson = (id) => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === id ? { ...item, status: "completed" } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bookings</Text>

      {requests.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <Text style={styles.name}>{booking.name}</Text>
          <Text style={styles.meta}>Date: {new Date(booking.date).toDateString()}</Text>
          <Text style={styles.meta}>Time: {booking.time}</Text>
          <Text style={styles.status}>
            Status: <Text style={styles.statusValue}>{booking.status}</Text>
          </Text>

          {booking.status === "pending" && (
            <View style={styles.actionsRow}>
              <Pressable style={[styles.button, styles.acceptButton]} onPress={() => acceptBooking(booking)}>
                <Text style={styles.buttonLightText}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.rejectButton]} onPress={() => rejectBooking(booking.id)}>
                <Text style={styles.buttonDarkText}>Reject</Text>
              </Pressable>
            </View>
          )}

          {booking.status === "accepted" && (
            <Pressable style={[styles.button, styles.completeButton]} onPress={() => completeLesson(booking.id)}>
              <Text style={styles.buttonLightText}>Mark Completed</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#123a72",
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
