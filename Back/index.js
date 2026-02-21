require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cors = require('cors');
const sql = neon(process.env.DATABASE_URL);
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4242;

// on fait une fucntion pour verifi si le mot de passe envoyé est correct au pas 
function permission(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    return res.status(401).json({erreur : 'Accés refusé, token manquant'})
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}

app.get('/reservations', async (req, res) =>{
    const resultat = await sql`SELECT * FROM reservations`;
    res.json(resultat);
})

app.post('/reservations', async (req, res) => {
  const { salon, nom, email, telephone, date_reservation, heure, service, commentaire } = req.body;

  // vérifier que la date est au minimum demain
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  const demain = new Date(aujourd_hui);
  demain.setDate(demain.getDate() + 1);

  const dateDemandee = new Date(date_reservation);

  if (dateDemandee < demain) {
    return res.status(400).json({ erreur: 'La date doit être à partir de demain.' });
  }

  // vérifier que l'heure est entre 09:00 et 21:00
  const heureDemandee = parseInt(heure.split(':')[0]);

  if (heureDemandee < 9 || heureDemandee >= 21) {
    return res.status(400).json({ erreur: 'L\'heure doit être entre 09:00 et 21:00.' });
  }

  const result = await sql`INSERT INTO reservations (salon, nom, email, telephone, date_reservation, heure, service, commentaire) VALUES (${salon}, ${nom}, ${email}, ${telephone}, ${date_reservation}, ${heure}, ${service}, ${commentaire}) RETURNING *`;
  res.json(result);
})

app.put('/reservations/:id', async (req, res) =>{
  const id = parseInt(req.params.id);
  const { date_reservation, heure } = req.body;

  // vérifier que la date est au minimum demain
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  const demain = new Date(aujourd_hui);
  demain.setDate(demain.getDate() + 1);

  const dateDemandee = new Date(date_reservation);

  if (dateDemandee < demain) {
    return res.status(400).json({ erreur: 'La date doit être à partir de demain.' });
  }

  // vérifier que l'heure est entre 09:00 et 21:00
  const heureDemandee = parseInt(heure.split(':')[0]);

  if (heureDemandee < 9 || heureDemandee >= 21) {
    return res.status(400).json({ erreur: 'L\'heure doit être entre 09:00 et 21:00.' });
  }

  const result = await sql`UPDATE reservations SET date_reservation = ${date_reservation}, heure = ${heure} WHERE id =${id} RETURNING *`;
  res.json(result);
})

app.delete('/reservations/:id', permission, async (req, res) => {
const id = parseInt(req.params.id);
const result = await sql`DELETE FROM reservations WHERE id = ${id}`;
res.json(result);
})

app.get('/salons', async (req, res) =>{
  const result = await sql`SELECT * FROM salons`;
  res.json(result);
})

app.post('/salons', async (req, res) => {
  const { nom , adresse } = req.body;
  const result = await sql `INSERT INTO salons(nom , adresse) VALUES (${nom},${adresse}) RETURNING * `;
  res.json(result);
})


app.put('/salons/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nom, adresse } = req.body;
  const result = await sql `UPDATE salons SET nom = ${nom}, adresse = ${adresse} WHERE id = ${id} RETURNING *`;
  res.json(result);
})

app.delete('/salons/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id)
  const result = await sql` DELETE FROM salons WHERE id = ${id}`;
  res.json(result)
})

app.post('/register', async (req, res) =>{
  const { nom, email, mot_de_passe } = req.body;
// ici on le sauvegarder dans la base de données
  const result = await sql`
  INSERT INTO users (nom, email, mot_de_passe)
  VALUES (${nom}, ${email}, ${mot_de_passe}) RETURNING *
  `;
  res.json({ message: 'Compte créé avec succés !'});
})

//le partie LOGIN -
app.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  // chercher l'utilisateur dans la base de données
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = users[0];

  // si l'utilisateur n'existe pas
  if (!user) {
    return res.status(400).json({ erreur: 'Email ou mot de passe incorrect' });
  }

  // on compare les mots de passe
  if (mot_de_passe !== user.mot_de_passe) {
    return res.status(400).json({ erreur: 'Email ou mot de passe incorrect' });
  }

  // créer le token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

  res.json({ message: 'Connexion réussie !', token });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});