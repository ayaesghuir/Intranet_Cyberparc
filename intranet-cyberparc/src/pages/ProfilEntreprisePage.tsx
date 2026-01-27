// src/pages/AnnuairePage.tsx

import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./profilEntreprise.css";
import type { User } from "./LoginPage";

type Company = {
  name: string;
  sector: string;
  location: string;
  phone: string;
  website?: string;
  description?: string;
  email: string;
};

type AnnuairePageProps = {
  user: User;
};

const AnnuairePage: FC<AnnuairePageProps> = ({ user }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/companies");
        const data = await res.json();
        setCompanies(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                         company.sector.toLowerCase().includes(search.toLowerCase()) ||
                         company.location.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || company.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  if (loading) {
    return (
      <div className="annuaire-root">
        <div className="annuaire-loading">Chargement des entreprises...</div>
      </div>
    );
  }

  return (
    <div className="annuaire-root">
      <header className="annuaire-header">
        <div className="annuaire-header-left">
          <Link to="/" className="annuaire-back-btn">← Retour</Link>
          <h1 className="annuaire-title">Annuaire des entreprises</h1>
        </div>
        <span className="annuaire-count">
          {filteredCompanies.length} entreprise(s)
        </span>
      </header>

      <main className="annuaire-main">
        {/* Filtres de recherche */}
        <div className="annuaire-filters">
          <input
            type="text"
            className="annuaire-search"
            placeholder="Rechercher par nom, secteur ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            className="annuaire-sector-filter"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="">Tous les secteurs</option>
            <option value="IT">IT / Tech</option>
            <option value="Tourisme">Tourisme</option>
            <option value="Industrie">Industrie</option>
            <option value="Commerce">Commerce</option>
            <option value="Services">Services</option>
            <option value="Autres">Autres</option>
          </select>
        </div>

        {/* Liste des entreprises */}
        <div className="annuaire-list">
          {filteredCompanies.length === 0 ? (
            <div className="annuaire-empty">
              <p>Aucune entreprise trouvée.</p>
              <p>Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Link
                key={company.email}
                to={`/entreprise/${encodeURIComponent(company.email)}`}
                className="annuaire-card"
              >
                <div className="annuaire-card-header">
                  <h3 className="annuaire-card-title">{company.name}</h3>
                  <span className="annuaire-card-sector">{company.sector}</span>
                </div>
                
                <div className="annuaire-card-body">
                  <div className="annuaire-card-location">
                    📍 {company.location}
                  </div>
                  <div className="annuaire-card-phone">
                    📞 {company.phone}
                  </div>
                  {company.website && (
                    <div className="annuaire-card-website">
                      🌐 <a href={company.website} target="_blank" rel="noopener noreferrer">
                        Visiter le site
                      </a>
                    </div>
                  )}
                </div>
                
                {company.description && (
                  <p className="annuaire-card-description">
                    {company.description.length > 100 
                      ? `${company.description.substring(0, 100)}...` 
                      : company.description
                    }
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AnnuairePage;
