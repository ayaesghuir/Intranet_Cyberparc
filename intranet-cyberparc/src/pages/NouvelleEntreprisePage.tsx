// src/pages/NouvelleEntreprisePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NouvelleEntreprise.css";

const NouvelleEntreprisePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    location: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.sector.trim() ||
      !formData.location.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      alert("❌ Tous les champs obligatoires doivent être remplis");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          sector: formData.sector,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }

      const result = await response.json();
      alert(
        "✅ Entreprise ajoutée: " + (result.company?.name || formData.name)
      );

      setFormData({
        name: "",
        sector: "",
        location: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Erreur: Vérifiez que le backend est lancé");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nouvelle-entreprise-page">
      <div className="nouvelle-entreprise-card">
        <div className="ne-header-row">
          <div>
            <h1 className="nouvelle-entreprise-title">Ajouter une entreprise</h1>
            <p className="nouvelle-entreprise-subtitle">
              Créer une nouvelle fiche entreprise dans le système.
            </p>
          </div>
          <button
            type="button"
            className="ne-cancel-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            ← Retour
          </button>
        </div>

        <form className="nouvelle-entreprise-form" onSubmit={handleSubmit}>
          <div className="ne-form-group">
            <label>
              Nom de l'entreprise
              <input
                name="name"
                className="ne-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ne-form-group">
            <label>
              Secteur d'activité
              <input
                name="sector"
                className="ne-input"
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ne-form-group">
            <label>
              Localisation
              <input
                name="location"
                className="ne-input"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ne-form-group">
            <label>
              Email de contact
              <input
                name="email"
                type="email"
                className="ne-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ne-form-group">
            <label>
              Téléphone
              <input
                name="phone"
                className="ne-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ne-form-group">
            <label>
              Mot de passe initial
              <input
                name="password"
                type="password"
                className="ne-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 caractères"
              />
            </label>
          </div>

          <div className="ne-actions">
            <button
              type="button"
              className="ne-cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="ne-submit-button"
              disabled={loading}
            >
              {loading ? "⏳ Enregistrement..." : "Enregistrer l'entreprise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouvelleEntreprisePage;
