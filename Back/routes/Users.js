// on importe Router depuis express pour créer les routes
import { Router } from 'express';

// on importe neon pour parler à la base de données
import { neon } from '@neondatabase/serverless';

// on importe jwt pour créer et vérifier les tokens
import jwt from 'jsonwebtoken';

const router = Router();
const sql = neon(process.env.DATABASE_URL);


router.post('/register', async (req, res) => {
  // on récupère les données envoyées par le front
  const { nom, email, mot_de_passe } = req.body;

  // on vérifie si l'email existe déjà dans la base de données
  const existant = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (existant.length > 0) {
    return res.status(400).json({ erreur: 'Cet email est déjà utilisé !' });
  }

  // on insère le nouvel utilisateur dans la base de données
  const result = await sql`INSERT INTO users (nom, email, mot_de_passe) VALUES (${nom}, ${email}, ${mot_de_passe}) RETURNING *`;
  res.json({ message: 'Compte créé avec succès !' });
});


router.post('/login', async (req, res) => {
  // on récupère les données envoyées par le front
  const { email, mot_de_passe } = req.body;

  // on cherche l'utilisateur dans la base de données
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = result[0];

  // si l'utilisateur n'existe pas ou le mot de passe est incorrect
  if (!user || user.mot_de_passe !== mot_de_passe) {
    return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
  }

  // on crée le token JWT avec les infos de l'utilisateur
  const token = jwt.sign(
    { id: user.id, email: user.email, nom: user.nom, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // on envoie le token au front
  res.json({ token });
});

export default router;