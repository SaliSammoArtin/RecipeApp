import { ScrollView, Text, StyleSheet } from "react-native";
import { recipes } from "../data/recipe";

export default function RecipeDetailScreen({ route }) {
  const recipe = recipes.find((recipe) => recipe.id === route.params.recipeId);

  if (!recipe) {
    return <Text>Receptet kunde inte hittas.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.category}>{recipe.category}</Text>

      <Text style={styles.heading}>Gör så här</Text>
      <Text style={styles.instructions}>{recipe.instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
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
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
});
