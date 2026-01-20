// src/pages/NouvelleAnnonce.tsx
import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "./LoginPage";
import "./NouvelleAnnonce.css";
import toast from "react-hot-toast";
type NouvelleAnnonceProps = {
  user: User;
};

const NouvelleAnnonce: FC<NouvelleAnnonceProps> = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("❌ Image trop grande (max 2MB)");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.description.trim()) {
      toast.error("❌ Titre et description sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: formData.titre,
          description: formData.description,
          image: formData.image || null,
          auteur: user?.email || "Admin",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Erreur backend:", err);
        toast.error("❌ Erreur lors de la publication");
        return;
      }

      const data = await res.json();
      console.log("✅ Annonce créée:", data);
      toast.success("✅ Annonce publiée avec succès");
      navigate("/"); // أو /admin-dashboard حسب routing متاعك
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("❌ Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nouvelle-annonce-page">
      <div className="nouvelle-annonce-card">
        <h1 className="nouvelle-annonce-title">Créer une nouvelle annonce</h1>

        <form className="nouvelle-annonce-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titre">Titre de l'annonce *</label>
            <input
              id="titre"
              name="titre"
              type="text"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex : Réunion générale des entreprises"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Détaillez le contenu de l'annonce..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image (optionnel, max 2MB)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Prévisualisation" />
                <button
                  type="button"
                  className="remove-preview"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                >
                  ✕ Supprimer
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "📤 Publication..." : "📤 Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouvelleAnnonce;
