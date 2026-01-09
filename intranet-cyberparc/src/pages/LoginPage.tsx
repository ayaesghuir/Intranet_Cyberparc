// src/pages/LoginPage.tsx
import React, { useState } from "react";
import "./LoginPage.css";

export type User = {
  id: number;
  email: string;
  role: "admin" | "company";
};

type LoginPageProps = {
  onLogin: (user: User) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // نقرأ من backend API
      const response = await fetch('http://localhost:3001/api/data');
      const data = await response.json();

      const found = data.users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!found) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      const user: User = {
        id: found.id,
        email: found.email,
        role: found.role as "admin" | "company",
      };

      onLogin(user);
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <div className="hero">
        <div className="brand">
          <div className="brand-logo">CP</div>
          <div className="brand-text">
            <span className="brand-title">Intranet Cyber Parc</span>
            <span className="brand-tagline">Espace interne sécurisé</span>
          </div>
        </div>

        <h1 className="hero-title">Welcome to Intranet Cyber Parc</h1>
        <p className="hero-subtitle">
          Plateforme interne de gestion des entreprises et des offres.
        </p>

        <div className="card">
          <h2 className="card-title">Login</h2>

          <form onSubmit={handleSubmit} className="form">
            <label className="label">
              Email
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="label">
              Mot de passe
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && (
              <p className="muted" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn primary">
              Connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
