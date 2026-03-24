import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import Dashboard from "./components/Dashboard";
import Bookings from "./components/Bookings";
import Profile from "./components/Profile";
import MapView from "./components/Mapview";
import Feedback from "./components/Feedback";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

function App() {
  const [page, setPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [instructorEmail, setInstructorEmail] = useState("");
  const tabs = [
    { key: "dashboard", label: "Home", icon: "🏠" },
    { key: "bookings", label: "Bookings", icon: "📅" },
    { key: "profile", label: "Profile", icon: "👤" },
    { key: "feedback", label: "Feedback", icon: "⭐" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleLogin = (email) => {
    setInstructorEmail(email);
    setIsAuthenticated(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInstructorEmail("");
  };

  const activePage = useMemo(() => {
    if (page === "bookings") return <Bookings />;
    if (page === "profile") return <Profile />;
    if (page === "map") return <MapView />;
    if (page === "feedback") return <Feedback />;
    if (page === "settings") return <Settings onLogout={handleLogout} />;
    return <Dashboard />;
  }, [page]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar barStyle="dark-content" />
        <Login onLogin={handleLogin} />
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
            <Text style={styles.loggedInText}>Logged in as {instructorEmail}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.mapButton} onPress={() => setPage("map")}>
              <Text style={styles.mapButtonText}>Open Map</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {activePage}
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
    width: 64,
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
    fontSize: 16,
    opacity: 0.7,
  },
  navIconActive: {
    fontSize: 16,
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
