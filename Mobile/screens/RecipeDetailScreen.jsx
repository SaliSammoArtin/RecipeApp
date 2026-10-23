import { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Button,
  Alert,
  Share,
} from "react-native";

import { deleteRecipe } from "../services/api";

export default function RecipeDetailScreen({ route, navigation, token }) {
  const [deleting, setDeleting] = useState(false);
  const recipe = route.params?.recipe;

  if (!recipe) {
    return <Text>Receptet kunde inte hittas.</Text>;
  }

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);

    try {
      await deleteRecipe(recipe.id);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Kunde inte ta bort receptet",
        error.message || "Försök igen.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert("Ta bort recept", `Vill du ta bort "${recipe.title}"?`, [
      {
        text: "Avbryt",
        style: "cancel",
      },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `${recipe.title}
Kategori: ${recipe.category}

Ingredienser:
${recipe.ingredients}

Gör så här:
${recipe.instructions}`,
      });
    } catch (error) {
  Alert.alert(
    "Delning",
    error.message || "Ett okänt fel uppstod."
  );
}
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.category}>{recipe.category}</Text>

      <Text style={styles.heading}>Ingredienser</Text>
      <Text style={styles.instructions}>{recipe.ingredients}</Text>

      <Text style={styles.heading}>Gör så här</Text>
      <Text style={styles.instructions}>{recipe.instructions}</Text>
      
      <Button title="Dela recept" onPress={handleShare} />

      {token && (
        <View style={styles.actions}>
          <Button
            title="Redigera recept"
            onPress={() => navigation.navigate("EditRecipe", { recipe })}
            disabled={deleting}
          />

          <Button
            title={deleting ? "Tar bort..." : "Ta bort recept"}
            color="#B91C1C"
            onPress={confirmDelete}
            disabled={deleting}
          />
        </View>
      )}
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
  },
  category: {
    marginTop: 8,
    color: "#6B7280",
  },
  heading: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: "#111827",
  },
  actions: {
    marginTop: 32,
  },
});
