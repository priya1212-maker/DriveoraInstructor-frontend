import { StyleSheet, Text, View } from "react-native";

function Feedback({ bookings = [], profile, reviews = [] }) {
  const completedLessons = bookings.filter((booking) => booking.status === "completed");
  const averageRating = profile?.rating ? Number(profile.rating).toFixed(1) : "0.0";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Feedback</Text>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Average rating</Text>
          <Text style={styles.summaryValue}>{averageRating} / 5</Text>
        </View>
        <View>
          <Text style={styles.summaryLabel}>Completed lessons</Text>
          <Text style={styles.summaryValue}>{completedLessons.length}</Text>
        </View>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.user}>No reviews yet</Text>
          <Text style={styles.comment}>
            Learner reviews will appear here after completed lessons are rated in the student app.
          </Text>
        </View>
      ) : (
        reviews.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardMeta}>
                <Text style={styles.user}>Learner #{item.userId}</Text>
                <Text style={styles.meta}>Booking #{item.bookingId}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.rating} / 5</Text>
              </View>
            </View>
            <Text style={styles.comment}>{item.comment || "No written comment provided."}</Text>
          </View>
        ))
      )}
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
    marginBottom: 14,
    color: "#123a72",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryLabel: {
    marginBottom: 4,
    fontSize: 13,
    color: "#475569",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#123a72",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  cardMeta: {
    flex: 1,
  },
  user: {
    marginBottom: 4,
    fontSize: 17,
    fontWeight: "700",
    color: "#123a72",
  },
  meta: {
    fontSize: 13,
    color: "#64748b",
  },
  ratingBadge: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#93c5fd",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  ratingText: {
    color: "#123a72",
    fontWeight: "700",
  },
  comment: {
    fontSize: 14,
    lineHeight: 21,
    color: "#334155",
  },
});

export default Feedback;
