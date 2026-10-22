import { View, Text, FlatList, StyleSheet } from "react-native";
import RecipeCard from "../components/RecipeCard";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getRecipes } from "../services/api";

export default function RecipeListScreen({ navigation }) {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useFocusEffect(
      useCallback(() => {
        let active = true;

        async function loadRecipes() {
          setLoading(true);
          setError("");

          try {
            const data = await getRecipes();

            if (active) {
              setRecipes(data);
            }
          } catch (error) {
            if (active) {
              setError(error.message || "Kunde inte hämta recepten.");
            }
          } finally {
            if (active) {
              setLoading(false);
            }
          }
        }

        loadRecipes();

        return () => {
          active = false;
        };
      }, []),
    );
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Laddar recept...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text accessibilityRole="alert">{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Recept</Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            category={item.category}
            onPress={() =>
              navigation.navigate("RecipeDetail", { recipe: item })
            }
          />
        )}
        ListEmptyComponent={<Text>Du har inga sparade recept ännu.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: "#4B5563",
  },
});
