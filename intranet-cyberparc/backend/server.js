const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DATA_FILE = './users.json';

// قراءة كل الـdata
app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data);
});

// إضافة شركة + إنشاء compte
app.post('/api/companies', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const emailExists = data.users.find(u => u.email === req.body.email);
  if (emailExists) {
    return res.status(400).json({ error: 'Cet email existe déjà' });
  }
  
  const newCompany = {
    id: data.companies.length + 1,
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone
  };
  data.companies.push(newCompany);
  
  const newUser = {
    id: data.users.length + 1,
    email: req.body.email,
    password: req.body.password,
    role: "company",
    companyName: req.body.name
  };
  data.users.push(newUser);
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ 
    success: true,
    company: newCompany, 
    user: { email: newUser.email, role: newUser.role }
  });
});

// تعديل شركة
app.put('/api/companies/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  
  const index = data.companies.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Entreprise introuvable' });
  }
  
  const oldEmail = data.companies[index].email;
  
  data.companies[index] = {
    ...data.companies[index],
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone
  };
  
  if (oldEmail) {
    const userIndex = data.users.findIndex(u => u.email === oldEmail);
    if (userIndex !== -1) {
      data.users[userIndex].email = req.body.email;
      data.users[userIndex].companyName = req.body.name;
    }
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, company: data.companies[index] });
});

// حذف شركة
app.delete('/api/companies/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  
  const company = data.companies.find(c => c.id === id);
  
  if (!company) {
    return res.status(404).json({ error: 'Entreprise introuvable' });
  }
  
  data.companies = data.companies.filter(c => c.id !== id);
  
  if (company.email) {
    data.users = data.users.filter(u => u.email !== company.email);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, message: 'Entreprise supprimée' });
});

// تعديل mot de passe user
app.put('/api/users/:id/password', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  
  const userIndex = data.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  
  data.users[userIndex].password = req.body.password;
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, message: 'Mot de passe modifié' });
});

// إضافة إعلان
app.post('/api/annonces', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  
  const newAnnonce = {
    id: (data.annonces?.length || 0) + 1,
    titre: req.body.titre,
    description: req.body.description,
    image: req.body.image || null,
    date: new Date().toISOString(),
    auteur: req.body.auteur || 'Admin',
    likes: [] // ⬅ نضيف array فارغ
  };
  
  if (!data.annonces) {
    data.annonces = [];
  }
  
  data.annonces.unshift(newAnnonce);
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, annonce: newAnnonce });
});

// قراءة الإعلانات
app.get('/api/annonces', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data.annonces || []);
});

// Toggle like (واحدة فقط)
app.post('/api/annonces/:id/like', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  
  const annonceIndex = data.annonces.findIndex(a => a.id === id);
  
  if (annonceIndex === -1) {
    return res.status(404).json({ error: 'Annonce introuvable' });
  }
  
  if (!data.annonces[annonceIndex].likes) {
    data.annonces[annonceIndex].likes = [];
  }
  
  const userEmail = req.body.userEmail;
  const likes = data.annonces[annonceIndex].likes;
  const alreadyLiked = likes.includes(userEmail);
  
  if (alreadyLiked) {
    data.annonces[annonceIndex].likes = likes.filter(email => email !== userEmail);
  } else {
    data.annonces[annonceIndex].likes.push(userEmail);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ 
    success: true, 
    likes: data.annonces[annonceIndex].likes.length,
    liked: !alreadyLiked
  });
});
// إضافة تعليق أو رد
app.post('/api/annonces/:id/comments', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  
  const annonceIndex = data.annonces.findIndex(a => a.id === id);
  
  if (annonceIndex === -1) {
    return res.status(404).json({ error: 'Annonce introuvable' });
  }
  
  if (!data.annonces[annonceIndex].comments) {
    data.annonces[annonceIndex].comments = [];
  }
  
  const newComment = {
    id: Date.now(),
    text: req.body.text,
    auteur: req.body.auteur,
    date: new Date().toISOString(),
    parentId: req.body.parentId || null, // ⬅ للـreplies
    replies: [] // ⬅ جديد
  };
  
  // لو reply، نزيدو تحت الـparent
  if (req.body.parentId) {
    const parentComment = data.annonces[annonceIndex].comments.find(
      c => c.id === req.body.parentId
    );
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newComment);
    }
  } else {
    // تعليق عادي
    data.annonces[annonceIndex].comments.push(newComment);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, comment: newComment });
});


// حذف تعليق
app.delete('/api/annonces/:annonceId/comments/:commentId', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const annonceId = parseInt(req.params.annonceId);
  const commentId = parseInt(req.params.commentId);
  
  const annonceIndex = data.annonces.findIndex(a => a.id === annonceId);
  
  if (annonceIndex === -1) {
    return res.status(404).json({ error: 'Annonce introuvable' });
  }
  
  if (!data.annonces[annonceIndex].comments) {
    return res.status(404).json({ error: 'Commentaire introuvable' });
  }
  
  data.annonces[annonceIndex].comments = data.annonces[annonceIndex].comments.filter(
    c => c.id !== commentId
  );
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true });
});


app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
// حذف إعلان
app.delete('/api/annonces/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const id = parseInt(req.params.id);
  const annonceExists = data.annonces.find(a => a.id === id);

  if (!annonceExists) {
    return res.status(404).json({ error: 'Annonce introuvable' });
  }

  data.annonces = data.annonces.filter(a => a.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true, message: 'Annonce supprimée' });
});


// ====== FORUM: messages ======

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET: messages d'un user
app.get("/api/messages/:email", (req, res) => {
  const email = req.params.email;
  const data = readData();

  if (!data.messages) {
    data.messages = [];
  }

  const list = data.messages.filter(
    (m) => m.sender === email || m.receiver === email
  );

  res.json(list);
});

// POST: envoyer message
app.post("/api/messages", (req, res) => {
  const data = readData();

  if (!data.messages) {
    data.messages = [];
  }

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

// آخر سطر في الملف
app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
