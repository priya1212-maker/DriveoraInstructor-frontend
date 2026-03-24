import { StyleSheet, Text, View } from "react-native";

function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>

          <View>
            <Text style={styles.name}>Amit Sharma</Text>
            <Text style={styles.role}>Senior Driving Instructor</Text>
          </View>
        </View>

        <Text style={styles.detail}>
          <Text style={styles.label}>Name: </Text>
          Amit Sharma
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Vehicle: </Text>
          Car
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Experience: </Text>
          5 years
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Age: </Text>
          45
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Gender: </Text>
          Male
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Charge: </Text>
          300 per hour
        </Text>
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
    marginBottom: 12,
    color: "#123a72",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#cfe6ff",
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    borderWidth: 3,
    borderColor: "#60a5fa",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#123a72",
    fontSize: 28,
    fontWeight: "800",
  },
  name: {
    marginBottom: 6,
    fontSize: 22,
    fontWeight: "800",
    color: "#123a72",
  },
  role: {
    fontSize: 14,
    color: "#475569",
  },
  detail: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 8,
  },
  label: {
    fontWeight: "700",
    color: "#2563eb",
  },
});

export default Profile;
