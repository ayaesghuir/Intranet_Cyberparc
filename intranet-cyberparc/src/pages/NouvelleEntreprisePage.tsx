// src/pages/NouvelleEntreprisePage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const NouvelleEntreprisePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    location: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sector: formData.sector,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      
      const result = await response.json();
      alert('✅ Entreprise ajoutée: ' + result.name);
      
      // Reset form
      setFormData({
        name: '',
        sector: '',
        location: '',
        email: '',
        phone: '',
        password: ''
      });
      
    } catch (error) {
      alert('❌ Erreur: Vérifiez que le backend est lancé');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Ajouter une entreprise</h1>
          <p className="admin-subtitle">
            Créer une nouvelle fiche entreprise dans le système.
          </p>
        </div>
        <Link to="/" className="admin-link-button">
          ← Retour au tableau de bord
        </Link>
      </header>

      <main className="admin-main">
        <section className="admin-panel" style={{ maxWidth: "700px" }}>
          <h2 className="admin-panel-title">Informations de l'entreprise</h2>
          <p className="admin-panel-text">
            Remplissez les champs ci-dessous pour ajouter une nouvelle entreprise.
          </p>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-label">
              Nom de l'entreprise
              <input
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-label">
              Secteur d'activité
              <input
                name="sector"
                className="admin-input"
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-label">
              Localisation
              <input
                name="location"
                className="admin-input"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-label">
              Email de contact
              <input
                name="email"
                type="email"
                className="admin-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-label">
              Téléphone
              <input
                name="phone"
                className="admin-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label className="admin-label">
            Mot de passe initial
            <input
                name="password"
                type="password"
                className="admin-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 caractères"
            />
            </label>

            <button type="submit" className="admin-primary-button">
              Enregistrer l'entreprise
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default NouvelleEntreprisePage;
