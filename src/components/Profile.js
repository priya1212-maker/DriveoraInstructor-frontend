import { StyleSheet, Text, View } from "react-native";

function Profile({ user, profile }) {
  const initials = (profile?.name || user?.name || "DI")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View>
            <Text style={styles.name}>{profile?.name || user?.name || "Instructor"}</Text>
            <Text style={styles.role}>Driving Instructor</Text>
          </View>
        </View>

        <Text style={styles.detail}>
          <Text style={styles.label}>Email: </Text>
          {user?.email || "Not available"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Phone: </Text>
          {profile?.phone || user?.phone || "Not available"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Vehicle: </Text>
          {profile?.vehicleType || "Not available"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Gender: </Text>
          {profile?.gender || "Not available"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Rating: </Text>
          {profile?.rating ?? "Not available"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Saved Location: </Text>
          {profile?.latitude && profile?.longitude
            ? `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`
            : "Not available"}
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
    textTransform: "capitalize",
  },
  label: {
    fontWeight: "700",
    color: "#2563eb",
  },
});

export default Profile;
