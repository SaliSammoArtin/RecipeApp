import * as SecureStore from "expo-secure-store";

export const API_URL = "http://10.0.2.2:8080";

export async function login(username, password) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Kunde inte nå servern. Kontrollera att den är igång.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Fel användarnamn eller lösenord.");
    }

    throw new Error("Inloggningen misslyckades. Försök igen.");
  }

  return response.json();
}

export async function getRecipes() {
  let response;

  try {
    response = await fetch(`${API_URL}/recipes`, {
      method: "GET",
    });
  } catch {
    throw new Error("Kunde inte nå servern.");
  }

  if (!response.ok) {
    throw new Error("Kunde inte hämta recepten.");
  }

  return response.json();
}

export async function register(username, password) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Kunde inte nå servern.");
  }

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Användarnamnet finns redan.");
    }

    throw new Error("Kontot kunde inte skapas.");
  }

  return response.json();
}

export async function createRecipe(recipe) {
  const token = await SecureStore.getItemAsync("recipeapp_token");

  if (!token) {
    throw new Error("Logga in för att skapa ett recept.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    });
  } catch {
    throw new Error("Kunde inte nå servern. Kontrollera att backend är igång.");
  }

  if (response.status === 401) {
    throw new Error("Din inloggning gäller inte längre. Logga ut och in igen.");
  }

  if (!response.ok) {
    throw new Error("Kunde inte spara receptet. Kontrollera uppgifterna.");
  }

  return response.json();
}

export async function deleteRecipe(id) {
  const token = await SecureStore.getItemAsync("recipeapp_token");

  if (!token) {
    throw new Error("Logga in för att ta bort ett recept.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/recipes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Kunde inte nå servern. Kontrollera att backend är igång.");
  }

  if (response.status === 403) {
    throw new Error("Du kan bara ta bort recept som du själv har skapat.");
  }

  if (response.status === 404) {
    throw new Error("Receptet finns inte längre.");
  }

  if (!response.ok) {
    throw new Error("Kunde inte ta bort receptet. Försök igen.");
  }
}

export async function updateRecipe(id, recipe) {
  const token = await SecureStore.getItemAsync("recipeapp_token");

  if (!token) {
    throw new Error("Logga in för att ändra ett recept.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/recipes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    });
  } catch {
    throw new Error("Kunde inte nå servern. Kontrollera att backend är igång.");
  }

  if (response.status === 403) {
    throw new Error("Du kan bara ändra recept som du själv har skapat.");
  }

  if (response.status === 404) {
    throw new Error("Receptet finns inte längre.");
  }

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera receptet. Försök igen.");
  }

  return response.json();
}