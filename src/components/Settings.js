import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

const availabilityOptions = ["Weekdays", "Weekends", "All Days"];
const languageOptions = ["English", "Hindi", "Tamil"];

function Settings({
  onLogout,
  profile,
  onSyncLocation,
  syncingLocation,
  onSaveSettings,
  savingSettings,
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [availability, setAvailability] = useState("Weekdays");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setNotificationsEnabled(profile?.notificationsEnabled ?? true);
    setDarkModeEnabled(profile?.darkModeEnabled ?? false);
    setAvailability(profile?.availability || "Weekdays");
    setLanguage(profile?.language || "English");
  }, [profile]);

  const handleSave = async () => {
    await onSaveSettings({
      notificationsEnabled,
      darkModeEnabled,
      availability,
      language,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Lesson notifications</Text>
            <Text style={styles.help}>Get reminders for upcoming driving lessons.</Text>
          </View>
          <Pressable
            style={notificationsEnabled ? styles.toggleOn : styles.toggleOff}
            onPress={() => setNotificationsEnabled((current) => !current)}
          >
            <Text style={notificationsEnabled ? styles.toggleOnText : styles.toggleOffText}>
              {notificationsEnabled ? "On" : "Off"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Dark mode</Text>
            <Text style={styles.help}>Store your preferred display mode for future app sessions.</Text>
          </View>
          <Pressable
            style={darkModeEnabled ? styles.toggleOn : styles.toggleOff}
            onPress={() => setDarkModeEnabled((current) => !current)}
          >
            <Text style={darkModeEnabled ? styles.toggleOnText : styles.toggleOffText}>
              {darkModeEnabled ? "On" : "Off"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Location sync</Text>
            <Text style={styles.help}>Update your saved teaching point from your current device position.</Text>
          </View>
          <Pressable
            style={styles.toggleOn}
            onPress={onSyncLocation}
            disabled={syncingLocation}
          >
            <Text style={styles.toggleOnText}>{syncingLocation ? "Syncing" : "Sync"}</Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Availability</Text>
          <View style={styles.optionRow}>
            {availabilityOptions.map((option) => (
              <Pressable
                key={option}
                style={availability === option ? styles.optionActive : styles.option}
                onPress={() => setAvailability(option)}
              >
                <Text style={availability === option ? styles.optionTextActive : styles.optionText}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.optionRow}>
            {languageOptions.map((option) => (
              <Pressable
                key={option}
                style={language === option ? styles.optionActive : styles.option}
                onPress={() => setLanguage(option)}
              >
                <Text style={language === option ? styles.optionTextActive : styles.optionText}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Instructor Id</Text>
          <Text style={styles.help}>{profile?.id || "Not available"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Current Rating</Text>
          <Text style={styles.help}>{profile?.rating ?? "Not available"}</Text>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={savingSettings}>
          {savingSettings ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </Pressable>

        <Pressable style={styles.connectionButton} onPress={() => Alert.alert("Connected", "Your instructor app is connected to the live Driveora backend.")}>
          <Text style={styles.connectionButtonText}>Check Connection</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
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
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  rowText: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#123a72",
  },
  help: {
    fontSize: 13,
    color: "#64748b",
  },
  toggleOn: {
    borderRadius: 999,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toggleOff: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 999,
    backgroundColor: "#eff6ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toggleOnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  toggleOffText: {
    color: "#123a72",
    fontWeight: "700",
  },
  field: {
    marginTop: 16,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionActive: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    color: "#123a72",
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  connectionButton: {
    marginTop: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  connectionButtonText: {
    color: "#123a72",
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutButtonText: {
    color: "#991b1b",
    fontWeight: "700",
  },
});

export default Settings;
