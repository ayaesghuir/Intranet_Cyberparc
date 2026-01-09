// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage, { type User } from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AnnuairePage from "./pages/AnnuairePage";
import NouvelleEntreprisePage from "./pages/NouvelleEntreprisePage";

import "./index.css";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>
  <Route
    path="/"
    element={
      user.role === "admin" ? (
        <AdminDashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <CompanyDashboard user={user} onLogout={() => setUser(null)} />
      )
    }
  />
  <Route path="/annuaire" element={<AnnuairePage />} />
  <Route path="/nouvelle-entreprise" element={<NouvelleEntreprisePage />} />
</Routes>

    </BrowserRouter>
  );
};

export default App;
