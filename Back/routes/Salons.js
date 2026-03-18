// on importe Router depuis express pour créer les routes
import { Router } from 'express';

// on importe neon pour parler à la base de données
import { neon } from '@neondatabase/serverless';

// on importe jwt pour vérifier les tokens
import jwt from 'jsonwebtoken';

const router = Router();
const sql = neon(process.env.DATABASE_URL);

// ce middleware s'exécute avant certaines routes pour vérifier que c'est bien un admin
// si c'est pas un admin on refuse l'accès

function verifierAdmin(req, res, next) {
    // on récupère le token depuis le header de la requête
    const authHeader = req.headers['authorization'];

    // si y'a pas de token on refuse
    if (!authHeader) {
        return res.status(401).json({ erreur: 'Token manquant' });
    }

    // on prend juste le token sans le mot "Bearer"
    const token = authHeader.split(' ')[1];

    // on vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // si c'est pas un admin on refuse
    if (decoded.role !== 'admin') {
        return res.status(403).json({ erreur: 'Accès refusé, admin seulement !' });
    }

    // on sauvegarde les infos de l'utilisateur et on laisse passer
    req.utilisateur = decoded;
    next();
}


// tout le monde peut voir les salons
router.get('/', async (req, res) => {
  const result = await sql`SELECT * FROM salons`;
  res.json(result);
});

// seul l'admin peut ajouter un salon
router.post('/', verifierAdmin, async (req, res) => {
  const { nom, adresse, Contact } = req.body;
  const result = await sql`INSERT INTO salons(nom, adresse, "Contact") VALUES (${nom}, ${adresse}, ${Contact}) RETURNING *`;
  res.json(result);
});

// seul l'admin peut modifier un salon
router.put('/:id', verifierAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { nom, adresse, Contact } = req.body;
  const result = await sql`UPDATE salons SET nom = ${nom}, adresse = ${adresse}, "Contact" = ${Contact} WHERE id = ${id} RETURNING *`;
  res.json(result);
});

// seul l'admin peut supprimer un salon
router.delete('/:id', verifierAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await sql`DELETE FROM salons WHERE id = ${id}`;
  res.json(result);
});

export default router;