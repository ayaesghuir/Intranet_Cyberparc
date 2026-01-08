import React, { useEffect, useState } from "react";
import axios from "axios";

type Company = {
  id: number;
  name: string;
  sector: string;
};

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Intranet Cyberparc</h1>
      <h2>Liste des entreprises</h2>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} - {c.sector}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
