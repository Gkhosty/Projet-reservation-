// on importe Router depuis express pour créer les routes
import { Router } from 'express';

// on importe neon pour parler à la base de données
import { neon } from '@neondatabase/serverless';

// on importe jwt pour vérifier les tokens
import jwt from 'jsonwebtoken';

const router = Router();
const sql = neon(process.env.DATABASE_URL);


router.get('/', async (req, res) => {
  // on récupère le token pour savoir qui est connecté
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // si c'est un admin on retourne toutes les réservations
  if (decoded.role === 'admin') {
    const resultat = await sql`SELECT * FROM reservations`;
    return res.json(resultat);
  }

  // si c'est un client on retourne seulement ses réservations
  const resultat = await sql`SELECT * FROM reservations WHERE user_id = ${decoded.id}`;
  res.json(resultat);
});

// créer une réservation
router.post('/', async (req, res) => {
  // on récupère les données envoyées par le front
  const { salon, nom, email, telephone, date_reservation, heure, service, commentaire } = req.body;

  // on récupère le token pour savoir qui est connecté
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_id = decoded.id;

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
    return res.status(400).json({ erreur: "L'heure doit être entre 09:00 et 21:00." });
  }

  // on vérifie que l'utilisateur n'a pas déjà 2 RDV ce jour là dans ce salon
  const rdvExistants = await sql`SELECT * FROM reservations WHERE user_id = ${user_id} AND salon = ${salon} AND date_reservation = ${date_reservation}`;

  if (rdvExistants.length >= 2) {
    return res.status(400).json({ erreur: 'Vous avez déjà 2 réservations dans ce salon pour cette date !' });
  }

  // on enregistre la réservation avec le user_id
  const result = await sql`INSERT INTO reservations (salon, nom, email, telephone, date_reservation, heure, service, commentaire, user_id) VALUES (${salon}, ${nom}, ${email}, ${telephone}, ${date_reservation}, ${heure}, ${service}, ${commentaire}, ${user_id}) RETURNING *`;
  res.json(result);
});

// modifier une réservation
router.put('/:id', async (req, res) => {
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
    return res.status(400).json({ erreur: "L'heure doit être entre 09:00 et 21:00." });
  }

  const result = await sql`UPDATE reservations SET date_reservation = ${date_reservation}, heure = ${heure} WHERE id = ${id} RETURNING *`;
  res.json(result);
});

// supprimer une réservation
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await sql`DELETE FROM reservations WHERE id = ${id}`;
  res.json(result);
});

export default router;