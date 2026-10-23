import { View, Text, FlatList, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import RecipeCard from "../components/RecipeCard";
import { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getRecipes } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = ["Alla", "Frukost", "Lunch", "Middag"];
const categoryColors = {
  Alla: "#E8E0F5",
  Frukost: "#FCE5C7",
  Lunch: "#DCEFE5",
  Middag: "#F8DFE6",
};

export default function RecipeListScreen({ navigation }) {

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alla");
  const [categoryLoaded, setCategoryLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreCategory() {
      try {
        const savedCategory = await AsyncStorage.getItem("recipeapp_category");

        if (active && categories.includes(savedCategory)) {
          setSelectedCategory(savedCategory);
        }
      } catch {
        if (active) {
          Alert.alert("Kategorier", "Den sparade kategorin kunde inte läsas.");
        }
      } finally {
        if (active) {
          setCategoryLoaded(true);
        }
      }
    }

    restoreCategory();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!categoryLoaded) return;

    AsyncStorage.setItem("recipeapp_category", selectedCategory).catch(() => {
      Alert.alert("Kategorier", "Ditt kategorival kunde inte sparas.");
    });
  }, [selectedCategory, categoryLoaded]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "Alla" ||
      (recipe.category ?? "").trim().toLowerCase() ===
        selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
  
  if (loading || !categoryLoaded) {
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
      <Text style={styles.title}>
        {" "}
        <Text style={styles.title}>Recept</Text>
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Sök recept..."
        placeholderTextColor="#6B7280"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        accessibilityLabel="Sök recept efter namn"
      />

      <View style={styles.categoryButtons}>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedCategory === category,
            }}
            style={[
              styles.categoryButton,
              { backgroundColor: categoryColors[category] },
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredRecipes}
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
        ListEmptyComponent={
          <Text>
            {recipes.length === 0
              ? "Det finns inga recept ännu."
              : "Inga recept matchar din sökning och kategori."}
          </Text>
        }
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
  searchInput: {
    backgroundColor: "#FFFFFF",
    color: "#111827",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    flexgrow: 1,
    minWidth: 0,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 24,
  },
  categoryButtonSelected: {
    borderColor: "#46546C",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#253247",
    textAlign: "center",
  },
  categoryTextSelected: {
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
