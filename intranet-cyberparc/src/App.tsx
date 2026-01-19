// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage, { type User } from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AnnuairePage from "./pages/AnnuairePage";
import NouvelleEntreprisePage from "./pages/NouvelleEntreprisePage";
import NouvelleAnnonce from "./pages/NouvelleAnnonce"; // ⬅ AJOUTE ÇA
import EntrepriseDetailsPage from "./pages/EntrepriseDetailsPage";
import "./index.css";
import AnnoncesPage from "./pages/AnnonceSection";
import Forum from "./pages/Forum";

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
         <Route
          path="/forum"
          element={<Forum user={user} />}/>
        <Route path="/annonces" element={<AnnoncesPage userEmail={user.email} />} />
        <Route path="/annuaire" element={<AnnuairePage />} />
        <Route path="/nouvelle-entreprise" element={<NouvelleEntreprisePage />} />
        <Route path="/nouvelle-annonce" element={<NouvelleAnnonce user={user} />} /> {/* ⬅ AJOUTE ÇA */}
        <Route path="/entreprise/:id" element={<EntrepriseDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
