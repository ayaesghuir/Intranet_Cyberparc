// src/pages/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import type { User } from "./LoginPage";

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="admin-root">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Espace Administrateur</h1>
          <p className="admin-subtitle">
            Gérer les entreprises, annonces et échanges internes.
          </p>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{user.email}</span>
          <button className="admin-logout" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* كروت الأقسام الرئيسية */}
        <section className="admin-cards">
          {/* Annuaire - كارت كاملة clickable */}
          <Link to="/annuaire" className="admin-card">
            <h2 className="admin-card-title">Annuaire</h2>
            <p className="admin-card-text">
              Accéder à la liste complète des entreprises du Cyber Parc.
            </p>
          </Link>

          {/* Forum - كارت كاملة clickable */}
          <Link to="/forum" className="admin-card">
            <h2 className="admin-card-title">Forum interne</h2>
            <p className="admin-card-text">
              Publier des annonces et communiquer avec les entreprises.
            </p>
          </Link>

          {/* Ajouter entreprise - كارت كاملة clickable */}
          <Link to="/nouvelle-entreprise" className="admin-card">
            <h2 className="admin-card-title">Ajouter une entreprise</h2>
            <p className="admin-card-text">
              Créer une fiche entreprise (nom, contact, domaine, etc.).
            </p>
          </Link>
        </section>

        {/* الصف اللي تحت الكروت */}
        <div className="admin-content-row">
          {/* panel: création annonce */}
          <section className="admin-panel">
            <h2 className="admin-panel-title">Créer une annonce rapide</h2>
            <p className="admin-panel-text">
              Formulaire simple pour ajouter une annonce (démo front uniquement).
            </p>

            <form className="admin-form">
              <label className="admin-label">
                Titre de l&apos;annonce
                <input className="admin-input" />
              </label>

              <label className="admin-label">
                Description
                <textarea className="admin-textarea" rows={3} />
              </label>

              <button type="button" className="admin-primary-button">
                Enregistrer
              </button>
            </form>
          </section>

          {/* panel جانبي يعمّر الفراغ */}
          <section className="admin-side-panel">
            <h3 className="admin-side-title">Activité récente</h3>
            <p>
              Prochainement : aperçu des dernières annonces, nouvelles
              entreprises et messages importants.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
