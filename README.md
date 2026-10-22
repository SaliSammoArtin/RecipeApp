## Testinloggning

Databasen och backend måste vara igång.

På en ny databas behöver testkontot först skapas.
Kör dessa två rader i en ny PowerShell-terminal:

```powershell
$body = '{"username":"demo_mobile","password":"Recept123!"}'
Invoke-RestMethod http://localhost:8080/auth/register -Method Post -ContentType "application/json" -Body $body
```