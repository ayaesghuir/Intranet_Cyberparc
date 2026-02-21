import { useParams, Link } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import type {  User } from "./LoginPage";

type Company = {
  id: number;
  name: string;
  sector: string;
  location: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
};
type MonProfile = {
  user: User;
};

const MonProfile: FC<MonProfile> = ({ user }) => {
  const email = user.email;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchCompany = async () => {
    try {
console.log("Searching for:", email);

const res = await fetch(`http://localhost:3001/api/company-profile/${email}`);

if (!res.ok) {
  throw new Error("Route introuvable");
}      const data: Company = await res.json();
      setCompany(data);
    } catch (err: any) {
      setError("Erreur de connexion au serveur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.email) fetchCompany();
  else {
    setError("Utilisateur non connecté");
    setLoading(false);
  }
}, [user]);



  // 1. Affichage pendant le chargement
  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Chargement en cours...</div>;
  }

  // 2. Affichage si erreur ou pas trouvé
  if (error || !company) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        <h2>Oupsi !</h2>
        <p>{error || "Entreprise introuvable"}</p>
        <Link to="/">Retour </Link>
      </div>
    );
  }

  // 3. Affichage du profil (Succès)
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>
      <Link to="/" style={{ color: "#666", textDecoration: "none" }}>← Retour à la liste</Link>
      
      <div style={{ marginTop: "20px", border: "1px solid #ddd", background: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h1 style={{ color: "#2c3e50", margin: "0 0 20px 0" }}>{company.name}</h1>
        
        <div style={{ display: "grid", gap: "15px" }}>
          <p><strong>📍 Localisation :</strong> {company.location}</p>
          <p><strong>🏷️ Secteur :</strong> {company.sector}</p>
          <p><strong>📧 Email :</strong> {company.email}</p>
          <p><strong>📞 Téléphone :</strong> {company.phone}</p>
          
          {company.website && (
            <p><strong>🌐 Site Web :</strong> 
              <a href={company.website} target="_blank" rel="noreferrer" style={{ marginLeft: "5px", color: "#3498db" }}>
                {company.website}
              </a>
            </p>
          )}

          {company.description && (
            <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <strong>Description :</strong>
              <p style={{ lineHeight: "1.6", color: "#555" }}>{company.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MonProfile;