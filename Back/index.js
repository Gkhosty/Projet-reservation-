require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cors = require('cors');
const sql = neon(process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4242;

app.get('/reservations', async (req, res) =>{
    const resultat = await sql`SELECT * FROM reservations`;
    res.json(resultat);
})

app.post('/reservations', async (req, res) => {
  const { salon, nom, email, telephone, date_reservation, heure, service, commentaire } = req.body;
  const result = await sql`INSERT INTO reservations (salon, nom, email, telephone, date_reservation, heure, service, commentaire) VALUES (${salon}, ${nom}, ${email}, ${telephone}, ${date_reservation}, ${heure}, ${service}, ${commentaire}) RETURNING *`;
  res.json(result);
})

app.put('/reservations/:id', async (req, res) =>{
const id = parseInt(req.params.id);
const { date_reservation, heure } = req.body;
const result = await sql`UPDATE reservations SET date_reservation = ${date_reservation}, heure = ${heure} WHERE id =${id} RETURNING *`;
res.json(result);
})

app.delete('/reservations/:id', async (req, res) => {
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



app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});