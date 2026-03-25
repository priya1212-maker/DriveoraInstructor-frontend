import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import API from "../services/api";

const DEFAULT_COORDS = {
  latitude: 28.6139,
  longitude: 77.209,
};

function Login({ onLoginSuccess }) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [vehicleType, setVehicleType] = useState("manual");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await API.loginInstructor(email.trim(), password.trim());
      await onLoginSuccess(response);
    } catch (apiError) {
      setError(apiError.message || "Unable to login.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill all required fields to create your account.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let locationPayload = DEFAULT_COORDS;
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status === "granted") {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        locationPayload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      const response = await API.registerInstructor({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        gender,
        vehicleType,
        latitude: locationPayload.latitude,
        longitude: locationPayload.longitude,
        rating: 4.8,
      });

      setSuccess("Account created successfully. Loading your instructor dashboard...");
      await onLoginSuccess(response);
    } catch (apiError) {
      setError(apiError.message || "Unable to create instructor account.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsCreateMode((current) => !current);
    setError("");
    setSuccess("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.card}>
        <Text style={styles.brand}>Driveora Instructor</Text>
        <Text style={styles.title}>
          {isCreateMode ? "Create Instructor Account" : "Instructor Login"}
        </Text>
        <Text style={styles.subtitle}>
          {isCreateMode
            ? "Create a live instructor profile connected to bookings, maps, and student requests."
            : "Sign in to manage your real bookings, location, and teaching profile."}
        </Text>

        {isCreateMode ? (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.optionRow}>
              {['male', 'female', 'other'].map((option) => (
                <Pressable
                  key={option}
                  style={gender === option ? styles.optionActive : styles.option}
                  onPress={() => setGender(option)}
                >
                  <Text style={gender === option ? styles.optionTextActive : styles.optionText}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Vehicle Type</Text>
            <View style={[styles.optionRow, { marginBottom: 12 }] }>
              {['manual', 'automatic'].map((option) => (
                <Pressable
                  key={option}
                  style={vehicleType === option ? styles.optionActive : styles.option}
                  onPress={() => setVehicleType(option)}
                >
                  <Text style={vehicleType === option ? styles.optionTextActive : styles.optionText}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="instructor@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        {isCreateMode ? (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
              style={styles.input}
            />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <Pressable
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={isCreateMode ? handleCreateAccount : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>{isCreateMode ? "Create Account" : "Login"}</Text>
          )}
        </Pressable>

        <Pressable style={styles.switchModeButton} onPress={switchMode}>
          <Text style={styles.switchModeText}>
            {isCreateMode
              ? "Already have an account? Login"
              : "New instructor? Create Account"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderTopWidth: 4,
    borderTopColor: "#60a5fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#123a72",
    marginBottom: 6,
  },
  brand: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b6b95",
    marginBottom: 18,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#123a72",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c5dcff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8fbff",
    color: "#0f172a",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 12,
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
    textTransform: "capitalize",
  },
  optionTextActive: {
    color: "#ffffff",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 10,
    fontWeight: "600",
  },
  successText: {
    color: "#166534",
    marginBottom: 10,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  switchModeButton: {
    marginTop: 12,
    alignItems: "center",
  },
  switchModeText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 13,
  },
});

export default Login;
