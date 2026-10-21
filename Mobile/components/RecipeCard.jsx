import { Pressable, Text, StyleSheet } from "react-native";

export default function RecipeCard({ title, category, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>{category}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
});
