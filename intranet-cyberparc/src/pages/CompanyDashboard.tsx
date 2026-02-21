// src/pages/CompanyDashboard.tsx
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CompanyDashboard.css";
import type { User } from "./LoginPage";

type CompanyDashboardProps = {
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
  likes?: string[];
  comments?: Comment[];
};

const CompanyDashboard: FC<CompanyDashboardProps> = ({ user, onLogout }) => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const[profil, setProfil]=useState(null);
  useEffect(() => {
    loadAnnonces();
  }, []);

  const loadAnnonces = () => {
    fetch("http://localhost:3001/api/annonces")
      .then((res) => res.json())
      .then((data) => setAnnonces(data))
      .catch((err) => console.error(err));
  };

  const handleLike = async (annonceId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/annonces/${annonceId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }),
        }
      );
      if (res.ok) loadAnnonces();
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (annonceId: number) => {
    const text = commentText[annonceId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/annonces/${annonceId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, auteur: user.email }),
        }
      );
      if (res.ok) {
        setCommentText({ ...commentText, [annonceId]: "" });
        loadAnnonces();
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        {/* SIDEBAR نفس فكرة admin */}
        <aside className="company-sidebar">
          <section className="company-cards">
           
            

            <Link to="/mon-profil" className="company-card">
              <h2 className="company-card-title">Mon profil</h2>
              <p className="company-card-text">
                Mettre à jour les informations de votre entreprise.
              </p>
            </Link>

            <Link to="/nouvelle-annonce" className="company-card">
              <h2 className="company-card-title">Nouvelle annonce</h2>
              <p className="company-card-text">
                Publier rapidement sur le forum.
              </p>
            </Link>

                  <Link to="/liste-entreprises" className="company-card">
                  <h2 className="company-card-title">liste entreprises</h2>
                  <p className="company-card-text">Découvrir toutes les entreprises</p>
             </Link>


          </section>
        </aside>

        {/* FEED نفسه متاع admin */}
        <section className="company-feed">
          <h2 className="company-feed-title">Fil d&apos;actualité</h2>

          {annonces.length === 0 ? (
            <div className="company-feed-empty">
              📢 Aucune annonce pour le moment.
            </div>
          ) : (
            <div className="company-feed-list">
              {annonces.map((a) => (
                <article key={a.id} className="company-post">
                  <div className="company-post-header">
                    <div className="company-post-avatar">
                      {a.auteur.charAt(0).toUpperCase()}
                    </div>
                    <div className="company-post-meta">
                      <strong>{a.auteur}</strong>
                      <span>
                        {new Date(a.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="company-post-content">
                    <h3 className="company-post-title">{a.titre}</h3>
                    <p className="company-post-description">
                      {a.description}
                    </p>
                  </div>

                  <div className="company-post-footer">
                    <button
                      className="company-post-action"
                      onClick={() => handleLike(a.id)}
                      style={{
                        color: a.likes?.includes(user.email)
                          ? "#3b82f6"
                          : "#6b7280",
                        fontWeight: a.likes?.includes(user.email)
                          ? "700"
                          : "600",
                      }}
                      >
                      👍 J&apos;aime{" "}
                      {a.likes && a.likes.length > 0 && `(${a.likes.length})`}
                    </button>

                    <button
                      className="company-post-action"
                      onClick={() =>
                        setShowComments({
                          ...showComments,
                          [a.id]: !showComments[a.id],
                        })
                      }
                    >
                      💬 Commenter{" "}
                      {a.comments &&
                        a.comments.length > 0 &&
                        `(${a.comments.length})`}
                    </button>
                  </div>

                  {showComments[a.id] && (
                    <div className="company-comments-wrapper">
                      {a.comments && a.comments.length > 0 && (
                        <div className="company-comments-list">
                          {a.comments.map((c) => (
                            <div key={c.id} className="company-comment">
                              <div className="company-comment-top">
                                <strong>{c.auteur}</strong>
                                <span>
                                  {new Date(c.date).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <p className="company-comment-text">
                                {c.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="company-comment-input-row">
                        <div className="company-comment-avatar">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <input
                          type="text"
                          placeholder="Écrire un commentaire..."
                          value={commentText[a.id] || ""}
                          onChange={(e) =>
                            setCommentText({
                              ...commentText,
                              [a.id]: e.target.value,
                            })
                          }
                          className="company-comment-input"
                        />
                        <button
                          onClick={() => handleComment(a.id)}
                          className="company-comment-send"
                        >
                          ➤
                        </button>
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

export default CompanyDashboard;
