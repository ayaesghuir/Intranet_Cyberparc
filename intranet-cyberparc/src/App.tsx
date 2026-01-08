import React, { useState } from "react";
import axios from "axios";

type Role = "ADMIN" | "COMPANY";

type User = {
  id: number;
  email: string;
  role: Role;
};

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get<User[]>("http://localhost:5000/users", {
        params: { email, password }
      });

      const found = res.data[0];

      if (!found) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      setUser(found);
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Intranet Cyberparc</h1>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email&nbsp;</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Mot de passe&nbsp;</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>Admin: admin@cyberparc.com / admin123</p>
        <p>Company: company@cyberparc.com / company123</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Intranet Cyberparc</h1>
      <p>
        Connecté en tant que {user.email} ({user.role})
      </p>
      <button onClick={handleLogout}>Se déconnecter</button>

      {user.role === "ADMIN" && (
        <>
          <h2>Espace ADMIN</h2>
          <p>Gestion des entreprises, utilisateurs, etc.</p>
        </>
      )}

      {user.role === "COMPANY" && (
        <>
          <h2>Espace ENTREPRISE</h2>
          <p>Vos informations d'entreprise et services.</p>
        </>
      )}
    </div>
  );
};

export default App;
