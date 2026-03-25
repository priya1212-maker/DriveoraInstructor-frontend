import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import API from "../services/api";

function MapView({ profile, bookings = [], onSyncLocation, syncingLocation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState("Preparing your map tools...");
  const [nearbyCount, setNearbyCount] = useState(0);
  const [loadingNearby, setLoadingNearby] = useState(false);

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

        if (permissionStatus !== "granted") {
          setStatus("Location permission is off, so your saved teaching location is shown.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("Live location is ready. You can sync it to your instructor profile anytime.");
      } catch {
        setStatus("Live location is unavailable right now, so your saved teaching location is shown.");
      }
    };

    fetchLiveLocation();
  }, []);

  useEffect(() => {
    const loadNearby = async () => {
      const source = userLocation || (profile?.latitude && profile?.longitude
        ? { latitude: profile.latitude, longitude: profile.longitude }
        : null);

      if (!source) {
        return;
      }

      try {
        setLoadingNearby(true);
        const nearby = await API.getNearbyInstructors(source.latitude, source.longitude, 10);
        setNearbyCount(nearby.length);
      } catch {
        setNearbyCount(0);
      } finally {
        setLoadingNearby(false);
      }
    };

    loadNearby();
  }, [profile?.latitude, profile?.longitude, userLocation]);

  const destination = useMemo(() => {
    if (profile?.latitude && profile?.longitude) {
      return {
        latitude: profile.latitude,
        longitude: profile.longitude,
        label: "Saved Teaching Location",
      };
    }

    return null;
  }, [profile?.latitude, profile?.longitude]);

  const openMap = async () => {
    if (!destination) {
      Alert.alert("Location unavailable", "Sync your instructor location first to open navigation.");
      return;
    }

    const origin = userLocation
      ? `${userLocation.latitude},${userLocation.longitude}`
      : `${destination.latitude},${destination.longitude}`;
    const target = `${destination.latitude},${destination.longitude}`;

    const mapUrl = Platform.OS === "ios"
      ? `http://maps.apple.com/?saddr=${origin}&daddr=${target}`
      : `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${target}`;

    const supported = await Linking.canOpenURL(mapUrl);
    if (!supported) {
      Alert.alert("Unable to open map", "Please install a maps app on this device.");
      return;
    }

    await Linking.openURL(mapUrl);
  };

  const nextBooking = bookings.find((booking) => booking.status === "accepted" || booking.status === "pending");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Map</Text>

      <View style={styles.locationRow}>
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Saved Teaching Location</Text>
          <Text style={styles.locationCoords}>
            {destination
              ? `${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)}`
              : "No saved location yet"}
          </Text>
        </View>
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Live Device Location</Text>
          <Text style={styles.locationCoords}>
            {userLocation
              ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : "Waiting for device location"}
          </Text>
        </View>
      </View>

      <View style={styles.mapCard}>
        <Text style={styles.mapPlaceholderTitle}>Navigation Tools</Text>
        <Text style={styles.mapPlaceholderText}>
          Open your maps app to navigate to your saved teaching location or sync your current device position back to Driveora.
        </Text>

        <Pressable style={styles.openMapButton} onPress={openMap}>
          <Text style={styles.openMapButtonText}>Open in Maps</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onSyncLocation} disabled={syncingLocation}>
          {syncingLocation ? (
            <ActivityIndicator color="#123a72" />
          ) : (
            <Text style={styles.secondaryButtonText}>Sync Live Location</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Map Summary</Text>
        <Text style={styles.summaryText}>
          Nearby instructors within 10 km: {loadingNearby ? "Loading..." : nearbyCount}
        </Text>
        <Text style={styles.summaryText}>
          Next learner: {nextBooking?.learner?.name || "No active booking"}
        </Text>
      </View>

      <Text style={styles.caption}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#123a72",
  },
  locationRow: {
    gap: 12,
    marginBottom: 14,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#cfe6ff",
  },
  locationTitle: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
  },
  locationCoords: {
    fontSize: 14,
    color: "#334155",
  },
  mapCard: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#60a5fa",
    padding: 18,
    gap: 10,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#123a72",
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: "#4b6b95",
    lineHeight: 21,
  },
  openMapButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  openMapButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#eff6ff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  secondaryButtonText: {
    color: "#123a72",
    fontWeight: "700",
  },
  summaryCard: {
    marginTop: 14,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#123a72",
    marginBottom: 6,
  },
  summaryText: {
    color: "#334155",
    marginBottom: 4,
  },
  caption: {
    marginTop: 10,
    color: "#4b6b95",
    fontSize: 13,
  },
});

export default MapView;
