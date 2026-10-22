import { useState } from "react";
import { ScrollView, Text, TextInput, Button, StyleSheet } from "react-native";

import { createRecipe } from "../services/api";

export default function CreateRecipeScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (saving) return;

    setError("");

    if (
      !title.trim() ||
      !category.trim() ||
      !ingredients.trim() ||
      !instructions.trim()
    ) {
      setError("Fyll i alla fält.");
      return;
    }

    setSaving(true);

    try {
      await createRecipe({
        title: title.trim(),
        category: category.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
      });

      navigation.goBack();
    } catch (error) {
      setError(error.message || "Kunde inte spara receptet.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Nytt recept</Text>

      <Text style={styles.label}>Receptets namn</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        editable={!saving}
        accessibilityLabel="Receptets namn"
      />

      <Text style={styles.label}>Kategori</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Till exempel Frukost"
        placeholderTextColor="#6B7280"
        editable={!saving}
        accessibilityLabel="Kategori"
      />

      <Text style={styles.label}>Ingredienser</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        editable={!saving}
        accessibilityLabel="Ingredienser"
      />

      <Text style={styles.label}>Gör så här</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        editable={!saving}
        accessibilityLabel="Tillagningsinstruktioner"
      />

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Button
        title={saving ? "Sparar..." : "Spara recept"}
        onPress={handleSave}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#111827",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  error: {
    color: "#B91C1C",
    marginBottom: 16,
  },
});
