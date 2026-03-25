import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import Dashboard from "./components/Dashboard";
import Bookings from "./components/Bookings";
import Profile from "./components/Profile";
import MapView from "./components/Mapview";
import Feedback from "./components/Feedback";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import API from "./services/api";

function App() {
  const [page, setPage] = useState("dashboard");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingLocation, setSyncingLocation] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const tabs = [
    { key: "dashboard", label: "Home", icon: "Home" },
    { key: "bookings", label: "Bookings", icon: "Bookings" },
    { key: "profile", label: "Profile", icon: "Profile" },
    { key: "feedback", label: "Feedback", icon: "Feedback" },
    { key: "settings", label: "Settings", icon: "Settings" },
  ];

  const refreshInstructorData = async (userId) => {
    setLoading(true);
    try {
      const response = await API.getInstructorBookings(userId);
      setProfile(response.instructor);
      setBookings(response.bookings);
      setReviews(response.reviews || []);
    } catch (error) {
      Alert.alert("Sync failed", error.message || "Unable to load instructor data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (response) => {
    setSession(response.user);
    setProfile(response.instructorProfile || null);
    setPage("dashboard");
    await refreshInstructorData(response.user.id);
  };

  const handleLogout = () => {
    setSession(null);
    setProfile(null);
    setBookings([]);
    setReviews([]);
    setPage("dashboard");
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await API.updateBookingStatus(bookingId, status);
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking,
        ),
      );
    } catch (error) {
      Alert.alert("Update failed", error.message || "Unable to update booking status.");
    }
  };

  const handleLocationSync = async () => {
    if (!session?.id) {
      return;
    }

    try {
      setSyncingLocation(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Location needed", "Please allow location access to sync your live map position.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const updatedProfile = await API.updateInstructorLocation(
        session.id,
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
      );

      setProfile(updatedProfile);
      Alert.alert("Location synced", "Your teaching location has been updated.");
    } catch (error) {
      Alert.alert("Sync failed", error.message || "Unable to update location.");
    } finally {
      setSyncingLocation(false);
    }
  };

  const handleSaveSettings = async (settingsPayload) => {
    if (!session?.id) {
      return;
    }

    try {
      setSavingSettings(true);
      const updatedProfile = await API.updateInstructorSettings(session.id, settingsPayload);
      setProfile(updatedProfile);
      Alert.alert("Saved", "Your instructor settings have been updated.");
    } catch (error) {
      Alert.alert("Save failed", error.message || "Unable to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (!session?.id) {
      return;
    }

    refreshInstructorData(session.id);
  }, [session?.id]);

  const activePage = useMemo(() => {
    if (page === "bookings") {
      return (
        <Bookings
          bookings={bookings}
          loading={loading}
          onRefresh={() => refreshInstructorData(session.id)}
          onStatusChange={handleStatusChange}
        />
      );
    }

    if (page === "profile") {
      return <Profile user={session} profile={profile} />;
    }

    if (page === "map") {
      return (
        <MapView
          user={session}
          profile={profile}
          bookings={bookings}
          onSyncLocation={handleLocationSync}
          syncingLocation={syncingLocation}
        />
      );
    }

    if (page === "feedback") {
      return <Feedback bookings={bookings} profile={profile} reviews={reviews} />;
    }

    if (page === "settings") {
      return (
        <Settings
          onLogout={handleLogout}
          profile={profile}
          onSyncLocation={handleLocationSync}
          syncingLocation={syncingLocation}
          onSaveSettings={handleSaveSettings}
          savingSettings={savingSettings}
        />
      );
    }

    return <Dashboard bookings={bookings} profile={profile} loading={loading} />;
  }, [bookings, loading, page, profile, reviews, savingSettings, session, syncingLocation]);

  if (!session) {
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar barStyle="dark-content" />
        <Login onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appShell}>
        <Navbar />

        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.appTitle}>Driveora Instructor</Text>
            <Text style={styles.loggedInText}>
              {session.name} • {session.email}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.mapButton} onPress={() => setPage("map")}>
              <Text style={styles.mapButtonText}>Open Map</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {loading && page === "dashboard" ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            activePage
          )}
        </ScrollView>

        <View style={styles.nav}>
          {tabs.map((tab) => (
            <NavButton
              key={tab.key}
              label={tab.label}
              icon={tab.icon}
              active={page === tab.key}
              onPress={() => setPage(tab.key)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function NavButton({ label, icon, active, onPress }) {
  return (
    <Pressable style={[styles.navButton, active && styles.navButtonActive]} onPress={onPress}>
      <Text style={active ? styles.navIconActive : styles.navIcon}>{icon}</Text>
      <Text style={active ? styles.navTextActive : styles.navText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#dff1ff",
  },
  appShell: {
    flex: 1,
    margin: 14,
    borderRadius: 22,
    backgroundColor: "#f8fcff",
    overflow: "hidden",
  },
  headerRow: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  titleBlock: {
    gap: 2,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#123a72",
  },
  loggedInText: {
    fontSize: 12,
    color: "#4b6b95",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  mapButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  mapButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingBottom: 22,
  },
  loaderWrap: {
    paddingVertical: 40,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#cfe6ff",
    backgroundColor: "#f2f8ff",
  },
  navButton: {
    width: 70,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  navButtonActive: {
    backgroundColor: "#e3efff",
  },
  navIcon: {
    fontSize: 12,
    opacity: 0.7,
    color: "#5b7aa6",
    fontWeight: "600",
  },
  navIconActive: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "700",
  },
  navText: {
    color: "#5b7aa6",
    fontWeight: "600",
    fontSize: 11,
  },
  navTextActive: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 11,
  },
});

export default App;
