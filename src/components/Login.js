import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function Login({ onLogin }) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    onLogin(email.trim());
  };

  const handleCreateAccount = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill all fields to create your account.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Account created. You can now login with your new credentials.");
    setIsCreateMode(false);
    setPassword("");
    setConfirmPassword("");
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
            ? "Set up a new instructor account to start using the app."
            : "Sign in to access your bookings and lessons."}
        </Text>

        {isCreateMode ? (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your name"
              style={styles.input}
            />
          </View>
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
          style={styles.loginButton}
          onPress={isCreateMode ? handleCreateAccount : handleLogin}
        >
          <Text style={styles.loginButtonText}>{isCreateMode ? "Create Account" : "Login"}</Text>
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
