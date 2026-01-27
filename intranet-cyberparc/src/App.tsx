// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage, { type User } from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AnnuairePage from "./pages/AnnuairePage";          
import AdminAnnuairePage from "./pages/AnnuairePage"; 
import NouvelleEntreprisePage from "./pages/NouvelleEntreprisePage";
import NouvelleAnnonce from "./pages/NouvelleAnnonce";
import EntrepriseDetailsPage from "./pages/EntrepriseDetailsPage";
import AnnoncesPage from "./pages/AnnonceSection";
import Forum from "./pages/Forum";
import ProfilEntreprisePage from "./pages/ProfilEntreprisePage";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ListeEntreprise from "./pages/ListeEntreprise";
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />

      <BrowserRouter>
        {!user ? (
          <LoginPage onLogin={setUser} />
        ) : (
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={
                user.role === "admin" ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <CompanyDashboard user={user} onLogout={handleLogout} />
                )
              }
            />

            {/* Forum */}
            <Route path="/forum" element={<Forum user={user} />} />

            {/* Annonces */}
            <Route
              path="/annonces"
              element={<AnnoncesPage userEmail={user.email} />}
            />

            {/* Mon profil entreprise */}
            <Route
              path="/mon-profil"
              element={<ProfilEntreprisePage user={user} />}
            />

            {/* Annuaire ENTREPRISE (read-only) */}
            <Route
              path="/annuaire"
              element={<AnnuairePage  />}
            />

            {/* Annuaire ADMIN (gestion) */}
            <Route
              path="/admin/annuaire"
              element={<AdminAnnuairePage  />}
            />

            {/* Nouvelle entreprise (admin) */}
            <Route
              path="/nouvelle-entreprise"
              element={<NouvelleEntreprisePage />}
            />

            {/* Nouvelle annonce */}
            <Route
              path="/nouvelle-annonce"
              element={<NouvelleAnnonce user={user} />}
            />

            {/* Détails entreprise */}
            <Route
              path="/liste-entreprises"
              element={<ListeEntreprise user={user} />}
            />  
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
