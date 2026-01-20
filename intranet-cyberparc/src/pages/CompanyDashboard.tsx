// src/pages/CompanyDashboard.tsx
import { FC } from "react";
import "./CompanyDashboard.css";
import type { User } from "./LoginPage";

type CompanyDashboardProps = {
  user: User;
  onLogout: () => void;
};

const CompanyDashboard: FC<CompanyDashboardProps> = ({
  user,
  onLogout,
}) => {
  return (
    <div className="company-root">
      <header className="company-header">
        <div>
          <h1 className="company-title">Espace Entreprise</h1>
          <p className="company-subtitle">
            Créer et suivre vos annonces et vos candidatures.
          </p>
        </div>
        <div className="company-header-right">
          <span className="company-user">{user.email}</span>
          <button className="company-logout" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="company-main">
        <section className="company-cards">
          <div className="company-card">
            <h2 className="company-card-title">Mes annonces</h2>
            <p className="company-card-text">
              Consulter et gérer toutes vos offres publiées.
            </p>
            <button className="company-link-button">
              Voir mes annonces
            </button>
          </div>

          <div className="company-card">
            <h2 className="company-card-title">Forum entreprise</h2>
            <p className="company-card-text">
              Echanger avec l&apos;administration et les autres entreprises.
            </p>
            <button className="company-link-button">Ouvrir le forum</button>
          </div>

          <div className="company-card">
            <h2 className="company-card-title">Mon profil</h2>
            <p className="company-card-text">
              Mettre à jour les informations de votre entreprise.
            </p>
            <button className="company-link-button">
              Modifier le profil
            </button>
          </div>
        </section>

        <section className="company-panel">
          <h2 className="company-panel-title">Créer une nouvelle annonce</h2>
          <p className="company-panel-text">
            Formulaire pour ajouter une offre destinée aux candidats du Cyber
            Parc.
          </p>

          <form className="company-form">
            <label className="company-label">
              Intitulé du poste
              <input className="company-input" />
            </label>

            <label className="company-label">
              Localisation
              <input className="company-input" />
            </label>

            <label className="company-label">
              Description
              <textarea className="company-textarea" rows={3} />
            </label>

            <button type="button" className="company-primary-button">
              Publier l&apos;offre
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CompanyDashboard;
