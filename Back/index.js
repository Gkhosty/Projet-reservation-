// on charge les variables d'environnement depuis le fichier .env
import 'dotenv/config';

// on importe express pour créer le serveur
import express from 'express';

// on importe cors pour autoriser le front à parler au back
import cors from 'cors';

// on importe les fichiers de routes
import usersRoute from './routes/Users.js';
import salonsRoute from './routes/Salons.js';
import reservationsRoute from './routes/Reservations.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4242;

// on dit à express d'utiliser chaque fichier de routes
app.use('/', usersRoute);
app.use('/salons', salonsRoute);
app.use('/reservations', reservationsRoute);

// on démarre le serveur
app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});