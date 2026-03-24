import { StyleSheet, Text, View } from "react-native";

function Feedback() {
  const feedbackItems = [
    {
      id: 1,
      user: "Rahul Sharma",
      rating: 5,
      lesson: "City Driving",
      date: "23 Mar 2026",
      comment:
        "Very patient and clear with instructions. Parking practice helped me a lot.",
    },
    {
      id: 2,
      user: "Priya Verma",
      rating: 4,
      lesson: "Highway Basics",
      date: "22 Mar 2026",
      comment:
        "Explained lane discipline really well and made the session comfortable.",
    },
    {
      id: 3,
      user: "Arjun Mehta",
      rating: 5,
      lesson: "Night Driving",
      date: "20 Mar 2026",
      comment:
        "Calm guidance and practical tips. I feel much more confident driving at night now.",
    },
  ];

  const averageRating = (
    feedbackItems.reduce((total, item) => total + item.rating, 0) / feedbackItems.length
  ).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Feedback</Text>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Average rating</Text>
          <Text style={styles.summaryValue}>{averageRating} / 5</Text>
        </View>
        <View>
          <Text style={styles.summaryLabel}>Total reviews</Text>
          <Text style={styles.summaryValue}>{feedbackItems.length}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {feedbackItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardMeta}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.meta}>
                  {item.lesson} | {item.date}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.rating} Star</Text>
              </View>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        ))}
      </View>
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
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
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
