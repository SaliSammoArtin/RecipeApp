import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { login } from "../services/api";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (loading) return;

    setError("");

    if (!username.trim() || !password) {
      setError("Fyll i användarnamn och lösenord.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(username.trim(), password);
      onLogin(result.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Receptappen</Text>

      <Text style={styles.label}>Användarnamn</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        accessibilityLabel="Användarnamn"
      />

      <Text style={styles.label}>Lösenord</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
        accessibilityLabel="Lösenord"
        onSubmitEditing={handleLogin}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? <ActivityIndicator style={styles.loading} /> : null}

      <Button
        title={loading ? "Loggar in..." : "Logga in"}
        onPress={handleLogin}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: "#B91C1C",
    marginBottom: 16,
  },
  loading: {
    marginBottom: 16,
  },
});
