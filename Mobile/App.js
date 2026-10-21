import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RecipeListScreen from "./screens/RecipeListScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen
              name="RecipeList"
              component={RecipeListScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="RecipeDetail"
              component={RecipeDetailScreen}
              options={{ title: "Recept" }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" options={{ title: "Logga in" }}>
            {() => <LoginScreen onLogin={setToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
