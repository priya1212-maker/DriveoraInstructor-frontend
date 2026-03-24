import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";

function MapView() {
  const [instructorLocation] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    label: "Instructor Location",
  });
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6219,
    longitude: 77.2183,
    label: "User Location",
  });
  const [status, setStatus] = useState(
    "Showing the default instructor and user locations."
  );

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

        if (permissionStatus !== "granted") {
          setStatus("Location permission not granted, so default user location is shown.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "User Location",
        });
        setStatus("Map is ready with your live location.");
      } catch {
        setStatus("Live location is unavailable, so default user location is shown.");
      }
    };

    fetchLiveLocation();
  }, []);

  const mapUrl = useMemo(() => {
    const origin = `${instructorLocation.latitude},${instructorLocation.longitude}`;
    const destination = `${userLocation.latitude},${userLocation.longitude}`;

    if (Platform.OS === "ios") {
      return `http://maps.apple.com/?saddr=${origin}&daddr=${destination}`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  }, [instructorLocation, userLocation]);

  const openMap = async () => {
    const supported = await Linking.canOpenURL(mapUrl);
    if (!supported) {
      Alert.alert("Unable to open map", "Please install a maps app on this device.");
      return;
    }

    await Linking.openURL(mapUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Map</Text>

      <View style={styles.locationRow}>
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>{instructorLocation.label}</Text>
          <Text style={styles.locationCoords}>
            {instructorLocation.latitude.toFixed(4)}, {instructorLocation.longitude.toFixed(4)}
          </Text>
        </View>
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>{userLocation.label}</Text>
          <Text style={styles.locationCoords}>
            {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        </View>
      </View>

      <View style={styles.mapCard}>
        <Text style={styles.mapPlaceholderTitle}>Navigation Route</Text>
        <Text style={styles.mapPlaceholderText}>
          Open the native maps app to view route and start turn-by-turn navigation.
        </Text>

        <Pressable style={styles.openMapButton} onPress={openMap}>
          <Text style={styles.openMapButtonText}>Open in Maps</Text>
        </Pressable>
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
  caption: {
    marginTop: 10,
    color: "#4b6b95",
    fontSize: 13,
  },
});

export default MapView;
