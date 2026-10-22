import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RecipeListScreen from "./screens/RecipeListScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import CreateRecipeScreen from "./screens/CreateRecipeScreen";
import EditRecipeScreen from "./screens/EditRecipeScreen";

const Stack = createNativeStackNavigator();
const TOKEN_KEY = "recipeapp_token";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreLogin() {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        setToken(savedToken);
      } catch {
        Alert.alert(
          "Inloggning",
          "Den sparade inloggningen kunde inte läsas. Logga in igen.",
        );
      } finally {
        setLoading(false);
      }
    }

    restoreLogin();
  }, []);

  async function handleLogin(newToken) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch {
      Alert.alert("Kunde inte spara inloggningen", "Försök att logga in igen.");
    }
  }

  async function handleLogout() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
    } catch {
      Alert.alert("Kunde inte logga ut", "Försök igen.");
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator
          size="large"
          accessibilityLabel="Laddar inloggning"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecipeList">
        <Stack.Group navigationKey={token ? "user" : "guest"}>
          <Stack.Screen
            name="RecipeList"
            component={RecipeListScreen}
            options={({ navigation }) => ({
              title: "",
              headerLeft: () =>
                token ? (
                  <Button
                    title="Nytt recept"
                    onPress={() => navigation.navigate("CreateRecipe")}
                  />
                ) : null,
              headerRight: () =>
                token ? (
                  <Button title="Logga ut" onPress={handleLogout} />
                ) : (
                  <Button
                    title="Logga in"
                    onPress={() => navigation.navigate("Login")}
                  />
                ),
            })}
          />

          <Stack.Screen name="RecipeDetail" options={{ title: "Recept" }}>
            {({ route, navigation }) => (
              <RecipeDetailScreen
                route={route}
                navigation={navigation}
                token={token}
              />
            )}
          </Stack.Screen>

          {token && (
            <Stack.Screen
              name="EditRecipe"
              component={EditRecipeScreen}
              options={{ title: "Redigera recept" }}
            />
          )}

          {token && (
            <Stack.Screen
              name="CreateRecipe"
              component={CreateRecipeScreen}
              options={{ title: "Skapa recept" }}
            />
          )}

          {!token && (
            <>
              <Stack.Screen name="Login" options={{ title: "Logga in" }}>
                {({ navigation }) => (
                  <LoginScreen onLogin={handleLogin} navigation={navigation} />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Skapa konto" }}
              />
            </>
          )}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
