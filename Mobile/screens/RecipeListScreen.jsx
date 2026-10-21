import { View, Text, FlatList, StyleSheet } from "react-native";
import RecipeCard from "../components/RecipeCard";
import { recipes } from "../data/recipe";

export default function RecipeListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mina recept</Text>

      <Text style={styles.description}>Här hittar du dina sparade recept.</Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            category={item.category}
            onPress={() =>
              navigation.navigate("RecipeDetail", { recipeId: item.id })
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
