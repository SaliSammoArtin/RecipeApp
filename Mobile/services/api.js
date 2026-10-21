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
