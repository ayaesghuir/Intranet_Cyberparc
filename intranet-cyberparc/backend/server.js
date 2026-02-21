// =======================
// 📁 Imports & config de base
// =======================
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Autoriser le front à accéder à l'API
app.use(cors());
const db = require("./db.json");
// Pour lire le JSON dans le body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Fichier de "base de données"
const DATA_FILE = "./users.json";

// =======================
// 🛠 Fonctions utilitaires
// =======================

// Lire tout le contenu de users.json
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Écrire dans users.json
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// =======================
// 🌐 Routes générales
// =======================

// GET: récupérer toutes les données brutes (debug)
app.get("/api/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// =======================
// 🏢 Gestion des entreprises (companies)
// =======================

// POST: ajouter une entreprise + créer un compte user
app.post("/api/companies", (req, res) => {
  const data = readData();

  // Vérifier si l'email existe déjà
  const emailExists = data.users.find((u) => u.email === req.body.email);
  if (emailExists) {
    return res.status(400).json({ error: "Cet email existe déjà" });
  }

  // Nouvelle entreprise
  const newCompany = {
    id: (data.companies?.length || 0) + 1,
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website || "",
    description: req.body.description || "",
  };

  if (!data.companies) data.companies = [];
  data.companies.push(newCompany);

  // Nouvel utilisateur lié à l'entreprise
  const newUser = {
    id: (data.users?.length || 0) + 1,
    email: req.body.email,
    password: req.body.password,
    role: "COMPANY",
    companyName: req.body.name,
  };

  if (!data.users) data.users = [];
  data.users.push(newUser);

  writeData(data);

  res.json({
    success: true,
    company: newCompany,
    user: { email: newUser.email, role: newUser.role },
  });
});

// PUT: modifier une entreprise par id
app.put("/api/companies/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const index = data.companies.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  const oldEmail = data.companies[index].email;

  // Mettre à jour les infos entreprise
  data.companies[index] = {
    ...data.companies[index],
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website || data.companies[index].website,
    description: req.body.description || data.companies[index].description,
  };

  // Mettre à jour l'utilisateur lié (email / nom entreprise)
  if (oldEmail) {
    const userIndex = data.users.findIndex((u) => u.email === oldEmail);
    if (userIndex !== -1) {
      data.users[userIndex].email = req.body.email;
      data.users[userIndex].companyName = req.body.name;
    }
  }

  writeData(data);
  res.json({ success: true, company: data.companies[index] });
});

// DELETE: supprimer une entreprise + user lié
app.delete("/api/companies/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const company = data.companies?.find((c) => c.id === id);
  if (!company) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  // Supprimer l'entreprise
  data.companies = data.companies.filter((c) => c.id !== id);

  // Supprimer le user lié si email existe
  if (company.email) {
    data.users = data.users.filter((u) => u.email !== company.email);
  }

  writeData(data);
  res.json({ success: true, message: "Entreprise supprimée" });
});

// GET: liste de toutes les entreprises (pour ListeEntreprise)
// → C'est cette route que ton front utilise: /api/liste-entreprise
app.get("/api/liste-entreprise", (req, res) => {
  const data = readData();
  const companies = data.companies || [];
  res.json(companies);
});

// =======================
// 👤 Gestion des utilisateurs (mot de passe)
// =======================

// PUT: modifier mot de passe d'un user
app.put("/api/users/:id/password", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const userIndex = data.users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  data.users[userIndex].password = req.body.password;
  writeData(data);

  res.json({ success: true, message: "Mot de passe modifié" });
});

// =======================
// 📢 Annonces (news / posts)
// =======================

// POST: ajouter une annonce
app.post("/api/annonces", (req, res) => {
  const data = readData();

  if (!data.annonces) data.annonces = [];

  const newAnnonce = {
    id: (data.annonces.length || 0) + 1,
    titre: req.body.titre,
    description: req.body.description,
    image: req.body.image || null,
    date: new Date().toISOString(),
    auteur: req.body.auteur || "Admin",
    likes: [],
    comments: [],
  };

  // On ajoute en début de liste
  data.annonces.unshift(newAnnonce);

  writeData(data);
  res.json({ success: true, annonce: newAnnonce });
});

// GET: lire toutes les annonces
app.get("/api/annonces", (req, res) => {
  const data = readData();
  res.json(data.annonces || []);
});

// POST: toggle like sur une annonce
app.post("/api/annonces/:id/like", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const annonceIndex = data.annonces.findIndex((a) => a.id === id);
  if (annonceIndex === -1) {
    return res.status(404).json({ error: "Annonce introuvable" });
  }

  if (!data.annonces[annonceIndex].likes) {
    data.annonces[annonceIndex].likes = [];
  }

  const userEmail = req.body.userEmail;
  const likes = data.annonces[annonceIndex].likes;
  const alreadyLiked = likes.includes(userEmail);

  if (alreadyLiked) {
    data.annonces[annonceIndex].likes = likes.filter(
      (email) => email !== userEmail
    );
  } else {
    data.annonces[annonceIndex].likes.push(userEmail);
  }

  writeData(data);

  res.json({
    success: true,
    likes: data.annonces[annonceIndex].likes.length,
    liked: !alreadyLiked,
  });
});

// POST: ajouter commentaire ou réponse
app.post("/api/annonces/:id/comments", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const annonceIndex = data.annonces.findIndex((a) => a.id === id);
  if (annonceIndex === -1) {
    return res.status(404).json({ error: "Annonce introuvable" });
  }

  if (!data.annonces[annonceIndex].comments) {
    data.annonces[annonceIndex].comments = [];
  }

  const newComment = {
    id: Date.now(),
    text: req.body.text,
    auteur: req.body.auteur,
    date: new Date().toISOString(),
    parentId: req.body.parentId || null,
    replies: [],
  };

  // Si c'est une réponse (reply)
  if (req.body.parentId) {
    const parentComment = data.annonces[annonceIndex].comments.find(
      (c) => c.id === req.body.parentId
    );
    if (parentComment) {
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(newComment);
    } else {
      // si parent introuvable → on le met comme commentaire normal
      data.annonces[annonceIndex].comments.push(newComment);
    }
  } else {
    // commentaire normal
    data.annonces[annonceIndex].comments.push(newComment);
  }

  writeData(data);
  res.json({ success: true, comment: newComment });
});

// DELETE: supprimer un commentaire (pas gestion des replies nested ici)
app.delete("/api/annonces/:annonceId/comments/:commentId", (req, res) => {
  const data = readData();
  const annonceId = parseInt(req.params.annonceId, 10);
  const commentId = parseInt(req.params.commentId, 10);

  const annonceIndex = data.annonces.findIndex((a) => a.id === annonceId);
  if (annonceIndex === -1) {
    return res.status(404).json({ error: "Annonce introuvable" });
  }

  if (!data.annonces[annonceIndex].comments) {
    return res.status(404).json({ error: "Commentaire introuvable" });
  }

  data.annonces[annonceIndex].comments =
    data.annonces[annonceIndex].comments.filter((c) => c.id !== commentId);

  writeData(data);
  res.json({ success: true });
});

// DELETE: supprimer une annonce
app.delete("/api/annonces/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);

  const annonceExists = data.annonces?.find((a) => a.id === id);
  if (!annonceExists) {
    return res.status(404).json({ error: "Annonce introuvable" });
  }

  data.annonces = data.annonces.filter((a) => a.id !== id);

  writeData(data);
  res.json({ success: true, message: "Annonce supprimée" });
});

// =======================
// 💬 FORUM: messages privés
// =======================

// GET: messages d'un user
app.get("/api/messages/:email", (req, res) => {
  const email = req.params.email;
  const data = readData();

  if (!data.messages) data.messages = [];

  const list = data.messages.filter(
    (m) => m.sender === email || m.receiver === email
  );

  res.json(list);
});

// POST: envoyer un message
app.post("/api/messages", (req, res) => {
  const data = readData();
  if (!data.messages) data.messages = [];

  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text?.trim()) {
    return res
      .status(400)
      .json({ error: "sender, receiver et text sont obligatoires" });
  }

  const newMessage = {
    id: Date.now(),
    sender,
    receiver,
    text: text.trim(),
    date: new Date().toISOString(),
  };

  data.messages.push(newMessage);
  writeData(data);

  res.status(201).json(newMessage);
});

// =======================
// 👤 Profil entreprise par email
// =======================

// GET: profil entreprise (company) par email
app.get("/api/company-profile/:email", (req, res) => {
  const data = readData();
  const email = req.params.email;

  const company = data.companies?.find((c) => c.email === email);
  if (!company) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  res.json(company);
});

// PUT: mise à jour profil entreprise par email (sans mot de passe)
app.put("/api/company-profile/:email", (req, res) => {
  const data = readData();
  const email = req.params.email;

  const index = data.companies.findIndex((c) => c.email === email);
  if (index === -1) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  data.companies[index] = {
    ...data.companies[index],
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    phone: req.body.phone,
    website: req.body.website,
    description: req.body.description,
  };

  writeData(data);

  res.json({ success: true, company: data.companies[index] });
});
// =======================
// 👤 Profil entreprise par email
// =======================
app.get("/api/company-profile/:email", (req, res) => {
  const data = readData();                    // Lire users.json
  const email = decodeURIComponent(req.params.email); // Récupérer l'email de l'URL

  // 🔹 Chercher l'entreprise dans users.json
  const company = data.users.find(
    (u) => u.email === email && u.role.toUpperCase() === "COMPANY"
  );

  // Si non trouvé
  if (!company) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  // Retourner le profil complet pour le front
  res.json({
    id: company.id,
    name: company.companyName,
    email: company.email,
    sector: company.sector || "",
    phone: company.phone || "",
    website: company.website || "",
    description: company.description || "",
  });
});


// =======================
// 🚀 Lancer le serveur
// =======================
app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});
