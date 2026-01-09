const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = './users.json';

// قراءة كل الـdata
app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data);
});

// إضافة شركة + إنشاء compte
app.post('/api/companies', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  
  // تحقق email مكرر
  const emailExists = data.users.find(u => u.email === req.body.email);
  if (emailExists) {
    return res.status(400).json({ error: 'Cet email existe déjà' });
  }
  
  // زيد الشركة
  const newCompany = {
    id: data.companies.length + 1,
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone
  };
  data.companies.push(newCompany);
  
  // زيد user
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
  
  // تحديث بيانات الشركة
  data.companies[index] = {
    ...data.companies[index],
    name: req.body.name,
    sector: req.body.sector,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone
  };
  
  // تحديث الـuser المرتبط (إذا تغيّر الـemail)
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
  
  // البحث عن الشركة قبل الحذف
  const company = data.companies.find(c => c.id === id);
  
  if (!company) {
    return res.status(404).json({ error: 'Entreprise introuvable' });
  }
  
  // حذف الشركة
  data.companies = data.companies.filter(c => c.id !== id);
  
  // حذف الـuser المرتبط بنفس الـemail
  if (company.email) {
    data.users = data.users.filter(u => u.email !== company.email);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.json({ success: true, message: 'Entreprise supprimée' });
});

app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
