// src/pages/AnnuairePage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AnnuairePage.css";

type Company = {
  id: number;
  name: string;
  sector: string;
  location: string;
  email?: string;
  phone?: string;
};

const AnnuairePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    location: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => setCompanies(data.companies))
      .catch(err => console.error(err));
  };

  const handleDelete = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation(); // ما ينشّطش الـlink
    
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert(`✅ "${name}" supprimée`);
        loadCompanies();
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      alert('❌ Erreur serveur');
      console.error(error);
    }
  };

  const handleEdit = (e: React.MouseEvent, company: Company) => {
    e.stopPropagation(); // ما ينشّطش الـlink
    
    setEditingId(company.id);
    setFormData({
      name: company.name,
      sector: company.sector,
      location: company.location,
      email: company.email || "",
      phone: company.phone || ""
    });
  };

  const handleUpdate = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('✅ Entreprise modifiée');
        setEditingId(null);
        loadCompanies();
      } else {
        alert('❌ Erreur lors de la modification');
      }
    } catch (error) {
      alert('❌ Erreur serveur');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="annuaire-root">
      <header className="annuaire-header">
        <div>
          <h1 className="annuaire-title">Annuaire des entreprises</h1>
          <p className="annuaire-subtitle">
            Liste des entreprises enregistrées dans le système.
          </p>
        </div>
        <Link to="/" className="annuaire-back-button">
          ← Retour au tableau de bord
        </Link>
      </header>

      <main className="annuaire-main">
        <div className="annuaire-grid">
          {companies.map((c) => (
            <div key={c.id} className="annuaire-card-wrapper">
              {/* Carte clickable → détails */}
              <Link 
                to={`/entreprise/${c.id}`}
                className="annuaire-card annuaire-card-clickable"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="annuaire-card-header">
                  <div className="annuaire-logo">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="annuaire-info">
                    <h3 className="annuaire-name">{c.name}</h3>
                    <p className="annuaire-location">📍 {c.location}</p>
                  </div>
                </div>

                <p className="annuaire-sector">{c.sector}</p>

                <div className="annuaire-tags">
                  <span className="annuaire-tag">Active</span>
                  <span className="annuaire-tag">Cyber Parc</span>
                </div>
              </Link>

              {/* Actions en dehors du Link */}
              <div className="annuaire-actions">
                <button 
                  className="annuaire-btn annuaire-btn-edit"
                  onClick={(e) => handleEdit(e, c)}
                >
                  ✏️ Modifier
                </button>
                <button 
                  className="annuaire-btn annuaire-btn-delete"
                  onClick={(e) => handleDelete(e, c.id, c.name)}
                >
                  🗑️ Supprimer
                </button>
              </div>

              {/* Formulaire sous la carte */}
              {editingId === c.id && (
                <div className="annuaire-edit-form">
                  <h4 className="annuaire-edit-title">Modifier les informations</h4>
                  
                  <form onSubmit={(e) => handleUpdate(e, c.id)} className="annuaire-form">
                    <label className="annuaire-label">
                      Nom
                      <input
                        name="name"
                        className="annuaire-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label className="annuaire-label">
                      Secteur
                      <input
                        name="sector"
                        className="annuaire-input"
                        value={formData.sector}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label className="annuaire-label">
                      Localisation
                      <input
                        name="location"
                        className="annuaire-input"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label className="annuaire-label">
                      Email
                      <input
                        name="email"
                        type="email"
                        className="annuaire-input"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="annuaire-label">
                      Téléphone
                      <input
                        name="phone"
                        className="annuaire-input"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </label>

                    <div className="annuaire-form-actions">
                      <button type="submit" className="annuaire-form-btn annuaire-form-btn-save">
                        💾 Enregistrer
                      </button>
                      <button 
                        type="button" 
                        className="annuaire-form-btn annuaire-form-btn-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        ✖️ Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AnnuairePage;
