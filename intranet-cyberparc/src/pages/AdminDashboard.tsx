// src/pages/AdminDashboard.tsx
import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import type { User } from "./LoginPage";
import toast from "react-hot-toast";
import useConfirmDelete from "../hooks/UserConfirmDelete";
type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

type Comment = {
  id: number;
  text: string;
  auteur: string;
  date: string;
};

type Annonce = {
  id: number;
  titre: string;
  description: string;
  date: string;
  auteur: string;
  image?: string;
  likes?: string[];
  comments?: Comment[];
};

const AdminDashboard: FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const confirmDelete = useConfirmDelete();

  useEffect(() => {
    loadAnnonces();
  }, []);
  // Test toast button


  const loadAnnonces = () => {
    fetch('http://localhost:3001/api/annonces')
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error(err));
  };

  const handleLike = async (annonceId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/annonces/${annonceId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email })
      });
      
      if (response.ok) {
        loadAnnonces();
      }
    } catch (error) {
      console.error(error);
    }
  };


const handleDeleteAnnonce = async (annonceId: number, titre: string) => {
  const confirmed = await confirmDelete(
    `🗑️ Supprimer l'annonce "${titre}" ?`
  );

  if (!confirmed) return;

  const toastId = toast.loading("⏳ Suppression en cours...");

  try {
    const response = await fetch(
      `http://localhost:3001/api/annonces/${annonceId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      toast.success("✅ Annonce supprimée", { id: toastId });
      loadAnnonces();
    } else {
      toast.error("❌ Erreur lors de la suppression", { id: toastId });
    }
  } catch (error) {
    console.error(error);
    toast.error("❌ Erreur serveur", { id: toastId });
  }
};


  const handleComment = async (annonceId: number) => {
    const text = commentText[annonceId]?.trim();
    if (!text) return;

    try {
      const response = await fetch(`http://localhost:3001/api/annonces/${annonceId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          auteur: user.email
        })
      });

      if (response.ok) {
        setCommentText({ ...commentText, [annonceId]: "" });
        loadAnnonces();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (annonceId: number, commentId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/annonces/${annonceId}/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadAnnonces();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        <aside className="admin-sidebar">
          <div className="admin-cards">
            <section className="admin-cards">
              <Link to="/annuaire" className="admin-card">
                <h2 className="admin-card-title">Annuaire</h2>
                <p className="admin-card-text">
                  Accéder à la liste complète des entreprises du Cyber Parc.
                </p>
              </Link>

              <Link to="/Forum" className="admin-card">
                <h2 className="admin-card-title">Forum interne</h2>
                <p className="admin-card-text">
                  Publier des annonces et communiquer avec les entreprises.
                </p>
              </Link>

              <Link to="/nouvelle-entreprise" className="admin-card">
                <h2 className="admin-card-title">Ajouter une entreprise</h2>
                <p className="admin-card-text">
                  Créer une fiche entreprise (nom, contact, domaine, etc.).
                </p>
              </Link>

              {/* ⬅ CHANGÉ: Lien vers page dédiée */}
              <Link to="/nouvelle-annonce" className="admin-card">
                <h2 className="admin-card-title">Nouvelle annonce</h2>
                <p className="admin-card-text">Publier rapidement sur le forum.</p>
              </Link>
            </section>
          </div>
        </aside>

        <section className="admin-feed">
          <h2 className="admin-feed-title">Fil d'actualité</h2>
          
          {annonces.length === 0 ? (
            <div className="admin-feed-empty">
              📢 Aucune annonce pour le moment.
            </div>
          ) : (
            <div className="admin-feed-list">
              {annonces.map((a) => (
                <article key={a.id} className="admin-post">
                  <div className="admin-post-header">
                    <div className="admin-post-avatar">
                      {a.auteur.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-post-meta">
                      <strong>{a.auteur}</strong>
                      <span>{new Date(a.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteAnnonce(a.id, a.titre)}
                      style={{
                        marginLeft: "auto",
                        border: "none",
                        background: "transparent",
                        color: "#ef4444",
                        fontSize: "18px",
                        cursor: "pointer",
                        padding: "4px 8px"
                      }}
                      title="Supprimer cette annonce"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="admin-post-content">
                    <h3 className="admin-post-title">{a.titre}</h3>
                    <p className="admin-post-description">{a.description}</p>
                  </div>

                  {a.image && (
                    <div className="admin-post-image">
                      <img src={a.image} alt={a.titre} />
                    </div>
                  )}

                  <div className="admin-post-footer">
                    <button 
                      className="admin-post-action"
                      onClick={() => handleLike(a.id)}
                      style={{
                        color: a.likes?.includes(user.email) ? "#3b82f6" : "#6b7280",
                        fontWeight: a.likes?.includes(user.email) ? "700" : "600"
                      }}
                    >
                      👍 J'aime {a.likes && a.likes.length > 0 && `(${a.likes.length})`}
                    </button>
                    
                    <button 
                      className="admin-post-action"
                      onClick={() => setShowComments({
                        ...showComments, 
                        [a.id]: !showComments[a.id]
                      })}
                    >
                      💬 Commenter {a.comments && a.comments.length > 0 && `(${a.comments.length})`}
                    </button>
                  </div>

                  {/* Section commentaires - INCHANGÉE */}
                  {showComments[a.id] && (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderTop: "1px solid #e5e7eb"
                    }}>
                      {a.comments && a.comments.length > 0 && (
                        <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          {a.comments.map((c) => (
                            <div 
                              key={c.id}
                              style={{
                                background: "#ffffff",
                                padding: "10px 12px",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb"
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <strong style={{ fontSize: "13px", color: "#111827" }}>
                                  {c.auteur}
                                </strong>
                                
                                {(c.auteur === user.email || user.role === 'admin') && (
                                  <button
                                    onClick={() => handleDeleteComment(a.id, c.id)}
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      color: "#ef4444",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                      padding: 0
                                    }}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              
                              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#4b5563" }}>
                                {c.text}
                              </p>
                              
                              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                                {new Date(c.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                          flexShrink: 0
                        }}>
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        
                        <div style={{ flex: 1, display: "flex", gap: "6px" }}>
                          <input
                            type="text"
                            placeholder="Écrire un commentaire..."
                            value={commentText[a.id] || ""}
                            onChange={(e) => setCommentText({
                              ...commentText,
                              [a.id]: e.target.value
                            })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(a.id);
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "20px",
                              border: "1px solid #d1d5db",
                              background: "#ffffff",
                              fontSize: "13px",
                              outline: "none"
                            }}
                          />
                          <button
                            onClick={() => handleComment(a.id)}
                            style={{
                              border: "none",
                              background: "#3b82f6",
                              color: "#fff",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              cursor: "pointer",
                              fontWeight: "600"
                            }}
                          >
                            ➤
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
