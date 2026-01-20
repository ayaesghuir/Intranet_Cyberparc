// src/components/AnnonceSection.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Annonce = {
  id: number;
  titre: string;
  description: string;
  date: string;
  auteur: string;
  image?: string;
  likes?: string[];
};

type AnnonceSectionProps = {
  userEmail: string;
};

const AnnonceSection: React.FC<AnnonceSectionProps> = ({ userEmail }) => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    loadAnnonces();
  }, []);

  const loadAnnonces = () => {
    fetch('http://localhost:3001/api/annonces')
      .then(res => res.json())
      .then(data => setAnnonces(data.slice(0, 5)))
      .catch(err => console.error(err));
  };

  const handleLike = async (annonceId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/annonces/${annonceId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: userEmail })
      });
      
      if (response.ok) {
        loadAnnonces();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('❌ La taille de l\'image ne doit pas dépasser 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/annonces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          auteur: userEmail
        })
      });
      
      if (response.ok) {
        toast.success('✅ Annonce publiée');
        setFormData({ titre: "", description: "", image: "" });
        loadAnnonces();
      } else {
        toast.error('❌ Erreur');
      }
    } catch (error) {
      toast.error('❌ Erreur serveur');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-content-row">
      {/* Formulaire */}
      <section className="admin-panel">
        <h2 className="admin-panel-title">Créer une annonce rapide</h2>
        <p className="admin-panel-text">
          Formulaire simple pour ajouter une annonce avec image (optionnel).
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-label">
            Titre de l'annonce
            <input 
              name="titre"
              className="admin-input"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </label>

          <label className="admin-label">
            Description
            <textarea 
              name="description"
              className="admin-textarea" 
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className="admin-label">
            Image (optionnel, max 2MB)
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="admin-input"
              style={{ padding: "4px 8px" }}
            />
          </label>

          {formData.image && (
            <div style={{ marginTop: "8px" }}>
              <img 
                src={formData.image} 
                alt="Aperçu" 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "150px", 
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }} 
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                style={{
                  marginTop: "6px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                ✕ Supprimer l'image
              </button>
            </div>
          )}

          <button type="submit" className="admin-primary-button">
            Enregistrer
          </button>
        </form>
      </section>

      {/* Activité récente avec J'aime */}
      <section className="admin-side-panel">
        <h3 className="admin-side-title">Activité récente</h3>
        
        {annonces.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Aucune annonce pour le moment.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {annonces.map((a) => (
              <div 
                key={a.id}
                style={{
                  padding: "12px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                }}
              >
                {a.image && (
                  <img 
                    src={a.image} 
                    alt={a.titre}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                  />
                )}
                
                <h4 style={{ 
                  margin: "0 0 4px", 
                  fontSize: "13px", 
                  fontWeight: "600",
                  color: "#111827"
                }}>
                  {a.titre}
                </h4>
                
                <p style={{ 
                  margin: "0 0 8px", 
                  fontSize: "12px", 
                  color: "#6b7280"
                }}>
                  {a.description.substring(0, 60)}
                  {a.description.length > 60 && "..."}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  borderTop: "1px solid #f3f4f6"
                }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {new Date(a.date).toLocaleDateString('fr-FR')}
                  </span>

                  {/* زر J'aime */}
                  <button
                    onClick={() => handleLike(a.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: a.likes?.includes(userEmail) ? "#3b82f6" : "#6b7280",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: a.likes?.includes(userEmail) ? "700" : "600",
                      transition: "all 0.15s ease"
                    }}
                  >
                    👍 {a.likes && a.likes.length > 0 && `${a.likes.length}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnnonceSection;
