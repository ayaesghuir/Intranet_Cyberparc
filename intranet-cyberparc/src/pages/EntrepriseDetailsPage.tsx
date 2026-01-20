// src/pages/EntrepriseDetailsPage.tsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminDashboard.css";
import toast from "react-hot-toast";
type Company = {
  id: number;
  name: string;
  sector: string;
  location: string;
  email?: string;
  phone?: string;
};

type User = {
  id: number;
  email: string;
  password: string;
  role: string;
};

const EntrepriseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => {
        const foundCompany = data.companies.find((c: Company) => c.id === parseInt(id || "0"));
        setCompany(foundCompany || null);
        
        // البحث عن user المرتبط
        if (foundCompany?.email) {
          const foundUser = data.users.find((u: User) => u.email === foundCompany.email);
          setUser(foundUser || null);
        }
      })
      .catch(err => console.error(err));
  };

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      
      if (response.ok) {
        toast.success('✅ Mot de passe modifié avec succès');
        setEditingPassword(false);
        setNewPassword("");
        loadData();
      } else {
        toast.error('❌ Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('❌ Erreur serveur');
      console.error(error);
    }
  };

  if (!company) {
    return (
      <div className="admin-root">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Détails de l'entreprise</h1>
          <p className="admin-subtitle">Informations complètes</p>
        </div>
        <Link to="/annuaire" className="admin-link-button">
          ← Retour à l'annuaire
        </Link>
      </header>

      <main className="admin-main">
        <section className="admin-panel" style={{ maxWidth: "700px" }}>
          {/* Header avec logo */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px", 
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "700",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
            }}>
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
                {company.name}
              </h2>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                {company.sector}
              </p>
            </div>
          </div>

          {/* Informations détaillées */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "10px"
            }}>
              <span style={{ fontSize: "24px" }}>📍</span>
              <div>
                <strong style={{ fontSize: "13px", color: "#6b7280" }}>Localisation</strong>
                <p style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: "600" }}>
                  {company.location}
                </p>
              </div>
            </div>

            {company.email && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "10px"
              }}>
                <span style={{ fontSize: "24px" }}>📧</span>
                <div>
                  <strong style={{ fontSize: "13px", color: "#6b7280" }}>Email</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "15px" }}>
                    <a href={`mailto:${company.email}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
                      {company.email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {company.phone && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "10px"
              }}>
                <span style={{ fontSize: "24px" }}>📞</span>
                <div>
                  <strong style={{ fontSize: "13px", color: "#6b7280" }}>Téléphone</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "15px" }}>
                    <a href={`tel:${company.phone}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
                      {company.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Mot de passe */}
            {user && (
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                background: "#fef3c7",
                borderRadius: "10px",
                border: "1px solid #fbbf24"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "24px" }}>🔐</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "13px", color: "#92400e" }}>Mot de passe</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", fontFamily: "monospace" }}>
                      {showPassword ? user.password : "••••••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      border: "none",
                      background: "#fbbf24",
                      color: "#78350f",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {showPassword ? "👁️ Masquer" : "👁️ Afficher"}
                  </button>
                </div>

                {!editingPassword ? (
                  <button
                    onClick={() => setEditingPassword(true)}
                    style={{
                      border: "none",
                      background: "#3b82f6",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      alignSelf: "flex-start"
                    }}
                  >
                    ✏️ Modifier le mot de passe
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px"
                      }}
                    />
                    <button
                      onClick={handleUpdatePassword}
                      style={{
                        border: "none",
                        background: "#22c55e",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      ✓ OK
                    </button>
                    <button
                      onClick={() => {
                        setEditingPassword(false);
                        setNewPassword("");
                      }}
                      style={{
                        border: "none",
                        background: "#ef4444",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "10px"
            }}>
              <span style={{ fontSize: "24px" }}>🏷️</span>
              <div>
                <strong style={{ fontSize: "13px", color: "#6b7280" }}>Statut</strong>
                <p style={{ margin: "6px 0 0" }}>
                  <span style={{
                    background: "#eef2ff",
                    color: "#4f46e5",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    Active • Cyber Parc
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EntrepriseDetailsPage;
