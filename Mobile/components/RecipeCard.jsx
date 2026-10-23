import { Pressable, Text, StyleSheet } from "react-native";

const categoryColors = {
  frukost: "#FFF0A3",
  lunch: "#DCEFE5",
  middag: "#F8DFE6",
};

export default function RecipeCard({ title, category, onPress }) {
  const normalizedCategory = (category ?? "").trim().toLowerCase();
  const accentColor = categoryColors[normalizedCategory] ?? "#E8E0F5";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${category}`}
      accessibilityHint="Öppnar receptets ingredienser och instruktioner"
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: accentColor },
        pressed && styles.cardPressed,
      ]}
    >
      <Text style={[styles.category, { backgroundColor: accentColor }]}>
        {category}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.link}>Visa recept</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7DCE2",
    borderLeftWidth: 6,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.85,
    borderColor: "#46546C",
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    color: "#253247",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
    color: "#253247",
  },
  link: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#253247",
    textDecorationLine: "underline",
  },
});
